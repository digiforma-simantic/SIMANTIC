<?php

use App\Http\Controllers\Api\v3\RfcController;
use Illuminate\Support\Facades\Route;

Route::prefix('v3')
    ->middleware(['auth:sanctum', 'throttle:60,1'])
    ->group(function () {
        Route::prefix('rfc')->group(function () {
            Route::get('/', [RfcController::class, 'index']);
            Route::get('/{id}', [RfcController::class, 'show']);
        });
    });