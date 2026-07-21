# PLAN — Load Balancing & Rate Limiting

## Architecture Overview

```
     User's Browser
          │
          ▼
  ┌───────────────────┐
  │   Next.js App     │
  │  (localhost:3000) │
  └─────────┬─────────┘
            │ fetch() to /api/*
            ▼
  ┌───────────────────┐
  │   LOAD BALANCER   │──▶ Laravel App #1
  │  (nginx/HAProxy)  │──▶ Laravel App #2
  │  round-robin      │──▶ Laravel App #3
  └───────────────────┘
            │
            ▼
  ┌───────────────────┐
  │   Redis Cluster   │── Sessions, Cache, Queue
  └───────────────────┘
            │
            ▼
  ┌───────────────────┐
  │   PostgreSQL      │
  │  (Supabase)       │
  └───────────────────┘
```

---

## Current Bottlenecks

### Critical
1. **Single PostgreSQL database** — handles app data, sessions, cache, AND queue polling
2. **Synchronous image uploads** — blocks HTTP response waiting for disk I/O
3. **`updateOrCreate` on scores** — race condition risk under concurrent judge scoring
4. **No caching** — `CACHE_STORE=database` but nothing is cached

### Moderate
5. **Database-backed queue with no jobs** — wasted polling overhead
6. **No pagination** on scores/criteria listing endpoints
7. **Bcrypt rounds at 12** — ~300ms CPU per registration

---

## Phase 1: Infrastructure (Prerequisites)

### 1.1 Add Redis

| Purpose | Current | Target |
|---------|---------|--------|
| Cache | `database` | `redis` |
| Queue | `database` | `redis` |
| Session | `database` | `redis` |

**Files to change:**
- `.env`: `CACHE_STORE=redis`, `QUEUE_CONNECTION=redis`, `SESSION_DRIVER=redis`
- `config/cache.php` — add Redis config
- `config/queue.php` — add Redis connection
- `config/session.php` — set driver to `redis`
- `composer.json` — install `predis/predis` or use `phpredis`

### 1.2 Configure Trusted Proxies

So Laravel generates correct URLs behind a load balancer:

**File:** `bootstrap/app.php`
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->trustProxies(at: '*');
})
```

---

## Phase 2: Rate Limiting

### 2.1 Define Rate Limiters

**File:** `bootstrap/app.php`
```php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

RateLimiter::for('api', fn (Request $request) => 
    Limit::perMinute(60)->by($request->user()?->id ?: $request->ip())
);

RateLimiter::for('auth', fn (Request $request) => 
    Limit::perMinute(10)->by($request->ip())
);

RateLimiter::for('scoring', fn (Request $request) => 
    Limit::perMinute(30)->by($request->user()?->id)
);

RateLimiter::for('uploads', fn (Request $request) => 
    Limit::perMinute(5)->by($request->user()?->id)
);
```

### 2.2 Apply to Routes

**File:** `routes/api.php`

| Route | Limiter |
|-------|---------|
| `/api/register`, `/api/login` | `auth` |
| All `/api/*` under `auth:sanctum` | `api` |
| `/api/pageants/{pageant}/scores` (POST) | `scoring` |
| `/api/candidates` (POST), `/api/candidates/{candidate}` (POST) | `uploads` |

```php
Route::middleware(['throttle:auth'])->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    Route::post('/pageants/{pageant}/scores', [ScoreController::class, 'store'])
        ->middleware('throttle:scoring');
    Route::post('/candidates', [CandidateController::class, 'store'])
        ->middleware('throttle:uploads');
    Route::post('/candidates/{candidate}', [CandidateController::class, 'update'])
        ->middleware('throttle:uploads');
    // ... existing routes
});
```

### 2.3 Return Consistent Headers

Laravel's throttle middleware automatically returns:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 58
Retry-After: 12
```

---

## Phase 3: Load Balancing

### 3.1 Make the App Stateless

Before scaling horizontally, ensure no server-local state:

| Area | Status | Action |
|------|--------|--------|
| Sessions | ❌ In database | Phase 1 moves to Redis |
| Cache | ❌ In database | Phase 1 moves to Redis |
| Queue | ❌ In database | Phase 1 moves to Redis |
| File uploads | ❌ Local disk | Move to S3-compatible storage |
| CSRF tokens | ✅ Stateless (API) | No action needed |

### 3.2 Change File Storage to S3

**File:** `.env`
```
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_DEFAULT_REGION=...
AWS_BUCKET=...
```

**File:** `config/filesystems.php` — add `s3` disk config.

Update `CandidateController` uploads to use S3 so any server instance can access the same files.

### 3.3 Horizontal Scaling (Laravel Octane)

**Option A: Laravel Octane (RoadRunner/Swoole)**
- Long-lived application workers
- Dramatically reduces memory/startup overhead per request
- Each worker handles thousands of requests before restarting

```
composer require laravel/octane
php artisan octane:install --server=roadrunner
```

**Option B: Traditional PHP-FPM**
- Adds PHP-FPM pool instances behind nginx
- Simpler but higher overhead per request

### 3.4 Nginx Load Balancer Config

**File:** `deploy/nginx-lb.conf`
```nginx
upstream laravel_backend {
    least_conn;
    server app1.example.com:8000;
    server app2.example.com:8000;
    server app3.example.com:8000;
}

server {
    listen 443 ssl;
    
    location / {
        proxy_pass http://laravel_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3.5 Health Check Endpoint

**File:** `routes/api.php`
```php
Route::get('/health', function () {
    try {
        DB::connection()->getPdo();
        Cache::store('redis')->has('health_check');
        return response()->json(['status' => 'healthy']);
    } catch (\Exception $e) {
        return response()->json(['status' => 'unhealthy'], 503);
    }
});
```

Configure the load balancer to check `GET /api/health` and remove unhealthy nodes.

---

## Phase 4: Performance Optimizations

### 4.1 Offload Image Uploads to Queue

**Create Job:** `app/Jobs/ProcessImageUpload.php`
```php
class ProcessImageUpload implements ShouldQueue
{
    public function __construct(public $candidateId, public $field, public $file) {}
    
    public function handle(): void
    {
        $path = $this->file->store('candidates', 's3');
        Candidate::where('id', $this->candidateId)
            ->update([$this->field => $path]);
    }
}
```

**Update CandidateController::store():**
```php
ProcessImageUpload::dispatch($candidate->id, 'primary_image', $request->file('primary_image'));
ProcessImageUpload::dispatch($candidate->id, 'hover_image', $request->file('hover_image'));
```

### 4.2 Fix Score Race Condition

Replace `updateOrCreate` with atomic upsert:

**File:** `app/Http/Controllers/ScoreController.php`
```php
Score::upsert(
    ['score' => $validated['score'], 'pageant_id', 'segment_id', 'candidate_id', 'criterion_id'],
    uniqueBy: ['pageant_id', 'segment_id', 'candidate_id', 'criterion_id'],
    update: ['score']
);
```

### 4.3 Add Pagination to Endpoints

| Endpoint | Change |
|----------|--------|
| `GET /pageants/{pageant}/scores` | Add `->paginate(50)` |
| `GET /pageants/{pageant}/criteria` | Add `->paginate(50)` or keep small |
| `GET /pageants/{pageant}/candidates` | Already has `paginate()` — verify limit |

### 4.4 Reduce Bcrypt Rounds

`.env`: `BCRYPT_ROUNDS=10` (default, saves ~150ms per hash)

---

## Deployment Order

```
Step 1:  Add Redis → move sessions, cache, queue
Step 2:  Configure S3 for file uploads
Step 3:  Implement rate limiting
Step 4:  Fix race conditions + pagination
Step 5:  Offload image uploads to queue jobs
Step 6:  Add health check endpoint
Step 7:  Deploy Octane / PHP-FPM on multiple servers
Step 8:  Set up nginx load balancer
Step 9:  Point DNS to load balancer
```

---

## Monitoring

After deployment, monitor:

| Metric | Tool | Threshold |
|--------|------|-----------|
| DB connection pool | Supabase dashboard | < 80% usage |
| Redis memory | `INFO memory` | < 70% used |
| App response time | Load balancer logs | p95 < 500ms |
| Queue lag | `php artisan queue:monitor` | < 5 seconds |
| Rate limit hits | Laravel log / metrics | Tune limits if > 20% blocked |
