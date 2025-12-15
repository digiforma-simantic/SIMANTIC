<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\v3\RfcController;
use Illuminate\Support\Facades\Route;


Route::prefix('auth')->group(function () {
    Route::post('/login', [LoginController::class, 'login']);
});

Route::prefix('v3')
    ->middleware(['auth:sanctum', 'throttle:60,1'])
    ->group(function () {
        Route::prefix('rfc')->group(function () {
            Route::get('/', [RfcController::class, 'index']);
            Route::get('/{id}', [RfcController::class, 'show']);


            Route::post('/{id}/approval', [RfcController::class, 'setRfcApproval']);
            Route::post('/{id}/approve', [RfcController::class, 'approvedRfcApproval']);
            Route::post('/rfc-approval/{id}/approval/need-info', [RfcController::class, 'needInfoRfcApproval']);
            Route::get('/rfc-approval/{id}', [RfcController::class, 'detailRfcApproval']);
        });
    });