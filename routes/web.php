<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\VerificationController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

// Booking demo
Route::prefix('booking')->name('booking.')->group(function () {
    Route::get('/', [BookingController::class, 'index'])->name('index');
    Route::get('/hotels/{id}', [BookingController::class, 'hotelDetail'])->name('hotels.show');
    Route::get('/cars/{id}', [BookingController::class, 'carDetail'])->name('cars.show');
    Route::get('/confirmation', [BookingController::class, 'confirmation'])->name('confirmation');
});

// Shop demo
Route::prefix('shop')->name('shop.')->group(function () {
    Route::get('/', [ShopController::class, 'index'])->name('index');
    Route::get('/products/{id}', [ShopController::class, 'productDetail'])->name('products.show');
    Route::get('/checkout', [ShopController::class, 'checkout'])->name('checkout');
    Route::get('/confirmation', [ShopController::class, 'confirmation'])->name('confirmation');
});

// EUDI Verification API
Route::prefix('api/verification')->name('verification.')->group(function () {
    Route::post('/init', [VerificationController::class, 'init'])->name('init');
    Route::get('/{transactionId}/status', [VerificationController::class, 'status'])->name('status');
});
