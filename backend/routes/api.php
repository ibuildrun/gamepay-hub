<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\WebhookController;
use App\Http\Controllers\Api\SteamController;
use App\Http\Controllers\Api\TelegramController;
use App\Http\Controllers\Api\GamesController;
use App\Http\Controllers\Api\GiftCardsController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Health check
Route::get('/health', fn() => response()->json(['status' => 'ok', 'timestamp' => now()]));

// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/telegram/callback', [AuthController::class, 'telegramCallback']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

// Steam routes
Route::prefix('steam')->group(function () {
    Route::post('/check-login', [SteamController::class, 'checkLogin']);
    Route::post('/calculate', [SteamController::class, 'calculate']);
    Route::post('/order', [SteamController::class, 'createOrder'])->middleware('auth:sanctum');
});

// Telegram Stars routes
Route::prefix('telegram')->group(function () {
    Route::post('/validate', [TelegramController::class, 'validateUsername']);
    Route::post('/calculate', [TelegramController::class, 'calculate']);
    Route::post('/order', [TelegramController::class, 'createOrder'])->middleware('auth:sanctum');
});

// Games routes
Route::prefix('games')->group(function () {
    Route::get('/', [GamesController::class, 'index']);
    Route::get('/search', [GamesController::class, 'search']);
    Route::get('/{appId}', [GamesController::class, 'show']);
    Route::post('/{appId}/order', [GamesController::class, 'createOrder'])->middleware('auth:sanctum');
});

// Gift Cards routes
Route::prefix('giftcards')->group(function () {
    Route::get('/', [GiftCardsController::class, 'index']);
    Route::get('/{id}', [GiftCardsController::class, 'show']);
    Route::post('/{id}/order', [GiftCardsController::class, 'createOrder'])->middleware('auth:sanctum');
});

// Orders routes (authenticated)
Route::middleware('auth:sanctum')->prefix('orders')->group(function () {
    Route::get('/', [OrderController::class, 'index']);
    Route::get('/{id}', [OrderController::class, 'show']);
    Route::post('/{id}/pay', [OrderController::class, 'pay']);
    Route::get('/{id}/receipt', [OrderController::class, 'receipt']);
});

// Webhooks (no auth, verified by signature)
Route::prefix('webhooks')->group(function () {
    Route::post('/paypalych', [WebhookController::class, 'handlePayPalych']);
    Route::post('/greengamepay', [WebhookController::class, 'handleGreenGamePay']);
});
