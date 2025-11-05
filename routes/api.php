<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\Auth\DevLoginController;
use App\Http\Controllers\Api\ConfigurationItemController;
use App\Http\Controllers\CmdbController;
use App\Http\Controllers\ChangeController;
use App\Http\Controllers\ChangeApprovalController;

/**
 * Public (tanpa token)
 */
Route::post('/auth/dev/login', [DevLoginController::class, 'login'])->name('auth.dev.login');
Route::get('/ping', fn () => response()->json(['message' => 'pong 🏓']))->name('ping');

/**
 * Protected v1 (butuh Bearer token Sanctum)
 * Final path: /api/v1/...
 */
Route::prefix('v1')
    ->middleware(['auth:sanctum', 'throttle:60,1'])
    ->group(function () {

        // Debug: cek siapa user yang login (hapus saat production)
        Route::get('me', fn (Request $r) => response()->json($r->user()))->name('me');

        /**
         * CMDB (CRUD Configuration Item)
         */
        Route::apiResource('config-items', ConfigurationItemController::class)
            ->parameters(['config-items' => 'config_item']) // pastikan implicit binding rapi
            ->names([
                'index'   => 'config-items.index',
                'store'   => 'config-items.store',
                'show'    => 'config-items.show',
                'update'  => 'config-items.update',
                'destroy' => 'config-items.destroy',
            ]);

        // Graph/Dependency untuk CI tertentu
        Route::get('config-items/{config_item}/graph', [CmdbController::class, 'show'])
            ->name('config-items.graph');

        /**
         * Change Management
         */
        Route::controller(ChangeController::class)->group(function () {
            Route::get ('changes',            'index')->name('changes.index');
            Route::post('changes',            'store')->name('changes.store');
            Route::get ('changes/{change}',   'show' )->name('changes.show'); // implicit binding ke App\Models\ChangeRequest
        });

        /**
         * Approval flow
         * Body JSON: { "stage":"kasi|kabid|diskominfo", "decision":"approve|reject|need_info", "note":"..." }
         */
        Route::post('changes/{change}/decisions', [ChangeApprovalController::class, 'decide'])
            ->name('changes.decisions');

        // Optional shortcut endpoints
        Route::post('changes/{change}/approve', [ChangeApprovalController::class, 'approve'])->name('changes.approve');
        Route::post('changes/{change}/reject',  [ChangeApprovalController::class, 'reject' ])->name('changes.reject');
    });

/**
 * Fallback JSON (API-friendly)
 */
Route::fallback(function () {
    return response()->json(['error' => 'Endpoint not found'], 404);
});
