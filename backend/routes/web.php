<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return response()->json([
        'name' => 'GamePay Hub API',
        'version' => '1.0.0',
        'documentation' => '/api/docs',
    ]);
});

// Payment redirect pages
Route::get('/payment/success', function () {
    return view('payment.success');
})->name('payment.success');

Route::get('/payment/fail', function () {
    return view('payment.fail');
})->name('payment.fail');
