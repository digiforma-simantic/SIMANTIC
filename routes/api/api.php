<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\v3\ConfigurationItemController;
use App\Http\Controllers\Api\v3\RfcController;
use App\Http\Controllers\Api\v3\UserController;
use Illuminate\Support\Facades\Route;


Route::prefix('auth')->group(function () {
    Route::post('/login', [LoginController::class, 'login']);
});

Route::prefix('v3')
    ->middleware(['auth:sanctum', 'throttle:60,1'])
    ->group(function () {

        /*
        |--------------------------------------------------------------------------
        | RFC
        |--------------------------------------------------------------------------
        */
        Route::prefix('rfc')->group(function () {

            // ✅ STATIC ROUTES (HARUS DI ATAS)
            Route::get('/rfc-approvals', [RfcController::class, 'getAllRfcApprovals']);
            Route::get('/rfc-approval/{id}', [RfcController::class, 'detailRfcApproval']);
            Route::post('/rfc-approval/{id}/approval/need-info', [RfcController::class, 'needInfoRfcApproval']);

            // ✅ BASE ROUTES
            Route::get('/', [RfcController::class, 'index']);
            Route::post('/{id}/approval', [RfcController::class, 'setRfcApproval']);
            Route::post('/{id}/approve', [RfcController::class, 'approvedRfcApproval']);

            // ❗ DYNAMIC TERAKHIR
            Route::get('/{id}', [RfcController::class, 'show']);
        });

        /*
        |--------------------------------------------------------------------------
        | CONFIGURATION ITEMS (CI)
        |--------------------------------------------------------------------------
        */
        Route::prefix('configuration-items')->group(function () {
            Route::get('/kode-bmd/{kodeBmd}', [ConfigurationItemController::class, 'showByKodeBmd']);
            Route::get('/by-asset/{assetId}',[ConfigurationItemController::class, 'showByAssetId']);
            Route::get('/by-user/{userId}', [ConfigurationItemController::class, 'getByUserId']);


            // ✅ CREATE CI
            Route::post('/', [ConfigurationItemController::class, 'store']);

            // (OPSIONAL – siap dikembangkan)
            Route::get('/', [ConfigurationItemController::class, 'index']);
            Route::get('/{id}', [ConfigurationItemController::class, 'show']);
            Route::put('/{id}', [ConfigurationItemController::class, 'update']);
            Route::delete('/{id}', [ConfigurationItemController::class, 'destroy']);
        });

        Route::get('/users', [UserController::class, 'index']);
    });
