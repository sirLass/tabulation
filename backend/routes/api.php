<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PageantController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\JudgeController;
use App\Http\Controllers\CriteriaController;
use App\Http\Controllers\SegmentController;
use App\Http\Controllers\ScoreController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/judges/login', [JudgeController::class, 'login']);
Route::get('/pageants/public', [PageantController::class, 'publicIndex']);
Route::get('/pageants/{pageant}', [PageantController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/pageants', [PageantController::class, 'index']);
    Route::post('/pageants', [PageantController::class, 'store']);
    Route::put('/pageants/{pageant}', [PageantController::class, 'update']);

    Route::get('/candidates', [CandidateController::class, 'index']);
    Route::post('/candidates', [CandidateController::class, 'store']);
    Route::post('/candidates/{candidate}', [CandidateController::class, 'update']);
    Route::delete('/candidates/{candidate}', [CandidateController::class, 'destroy']);
    Route::post('/pageants/{pageant}/candidates', [CandidateController::class, 'attachToPageant']);
    Route::get('/pageants/{pageant}/candidates', [CandidateController::class, 'pageantCandidates']);
    Route::get('/candidates/{candidate}/pageants', [CandidateController::class, 'candidatePageants']);

    Route::get('/judges', [JudgeController::class, 'index']);
    Route::post('/judges', [JudgeController::class, 'store']);
    Route::delete('/judges/{judge}', [JudgeController::class, 'destroy']);

    Route::get('/pageants/{pageant}/criteria', [CriteriaController::class, 'index']);
    Route::post('/pageants/{pageant}/criteria', [CriteriaController::class, 'store']);
    Route::get('/criteria/{criterion}', [CriteriaController::class, 'show']);
    Route::put('/criteria/{criterion}', [CriteriaController::class, 'update']);
    Route::delete('/criteria/{criterion}', [CriteriaController::class, 'destroy']);

    Route::get('/pageants/{pageant}/segments', [SegmentController::class, 'index']);
    Route::post('/pageants/{pageant}/segments', [SegmentController::class, 'store']);
    Route::get('/segments/{segment}', [SegmentController::class, 'show']);
    Route::put('/segments/{segment}', [SegmentController::class, 'update']);
    Route::delete('/segments/{segment}', [SegmentController::class, 'destroy']);

    Route::get('/pageants/{pageant}/scores', [ScoreController::class, 'index']);
    Route::post('/pageants/{pageant}/scores', [ScoreController::class, 'store']);
    Route::get('/pageants/{pageant}/segment-averages', [ScoreController::class, 'segmentAverages']);
    Route::post('/pageants/{pageant}/segment-averages', [ScoreController::class, 'saveSegmentAverage']);
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