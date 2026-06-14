<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PageantController;
use App\Http\Controllers\CandidateController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/pageants/public', [PageantController::class, 'publicIndex']);
Route::get('/pageants/{pageant}', [PageantController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/pageants', [PageantController::class, 'index']);
    Route::post('/pageants', [PageantController::class, 'store']);

    Route::get('/candidates', [CandidateController::class, 'index']);
    Route::post('/candidates', [CandidateController::class, 'store']);
    Route::post('/pageants/{pageant}/candidates', [CandidateController::class, 'attachToPageant']);
    Route::get('/pageants/{pageant}/candidates', [CandidateController::class, 'pageantCandidates']);
});

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Add your test route here ↓
Route::get('/hello', function () {
    return response()->json([
        'message' => 'Laravel & Next.js connected!'
    ]);
});