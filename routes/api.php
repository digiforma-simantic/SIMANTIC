<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\Auth\DevLoginController;
use App\Http\Controllers\Api\ConfigurationItemController;
use App\Http\Controllers\Api\RfcController;
use App\Http\Controllers\CmdbController;
use App\Http\Controllers\ChangeController;
use App\Http\Controllers\ChangeApprovalController;

// Tambahan modul baru
use App\Http\Controllers\Api\MaintenanceJobController;
use App\Http\Controllers\Api\PatchCatalogController;
use App\Http\Controllers\Api\PatchJobController;
use App\Http\Controllers\Api\ReportController;

/**
 * Public (tanpa token)
 */
Route::post('/auth/dev/login', [DevLoginController::class, 'login'])
    ->name('auth.dev.login');

Route::get('/ping', fn () => response()->json(['message' => 'pong 🏓']))
    ->name('ping');

Route::get('sso/callback', fn () => response()->json(['message' => 'pong 🏓']))
    ->name('ping');

Route::post('/v1/rfc',      [RfcController::class, 'store'])->name('rfc.store');

/**
 * Protected v1 (butuh Bearer token Sanctum)
 * Final path: /api/v1/...
 */
Route::prefix('v1')
    ->middleware(['auth:sanctum', 'throttle:60,1'])
    ->group(function () {

        // Debug: cek siapa user yang login (hapus saat production)
        Route::get('me', fn (Request $r) => response()->json($r->user()))
            ->name('me');
Route::get('/sso/callback',[AuthController::class,'SSOCallback']);
        /**
         * CMDB (CRUD Configuration Item)
         */
        Route::apiResource('config-items', ConfigurationItemController::class)
            ->parameters(['config-items' => 'config_item'])
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
         * RFC (Request for Change)
         */
        Route::get('rfc',       [RfcController::class, 'index'])->name('rfc.index');
        Route::get('rfc/{rfc}', [RfcController::class, 'show' ])->name('rfc.show');

        /**
         * Change Management
         */
        Route::controller(ChangeController::class)->group(function () {
            Route::get ('changes',          'index')->name('changes.index');
            Route::post('changes',          'store')->name('changes.store');
            Route::get ('changes/{change}', 'show' )->name('changes.show');
        });

        /**
         * Approval flow
         * Body JSON: { "stage":"kasi|kabid|diskominfo", "decision":"approve|reject|need_info", "note":"..." }
         */
        Route::post('changes/{change}/decisions', [ChangeApprovalController::class, 'decide'])
            ->name('changes.decisions');
        Route::post('changes/{change}/approve', [ChangeApprovalController::class, 'approve'])
            ->name('changes.approve');
        Route::post('changes/{change}/reject',  [ChangeApprovalController::class, 'reject'])
            ->name('changes.reject');

        /**
         * Maintenance Management
         *  - GET  /api/v1/maintenance-jobs
         *  - POST /api/v1/maintenance-jobs
         *  - GET  /api/v1/maintenance-jobs/{maintenance_job}
         *  - POST /api/v1/maintenance-jobs/{job}/result
         */
        Route::get ('maintenance-jobs',                    [MaintenanceJobController::class, 'index']);
        Route::post('maintenance-jobs',                    [MaintenanceJobController::class, 'store']);
        Route::get ('maintenance-jobs/{maintenance_job}',  [MaintenanceJobController::class, 'show']);
        Route::post('maintenance-jobs/{job}/result',       [MaintenanceJobController::class, 'storeResult']);

        /**
         * Patch Catalog
         *  - GET  /api/v1/patch-catalogs
         *  - POST /api/v1/patch-catalogs
         *  - GET  /api/v1/patch-catalogs/{patch_catalog}
         */
        Route::apiResource('patch-catalogs', PatchCatalogController::class)
            ->only(['index', 'store', 'show'])
            ->parameters(['patch-catalogs' => 'patch_catalog']);

        /**
         * Patch Deployment (Patch Job)
         *  - GET  /api/v1/patch-jobs
         *  - POST /api/v1/patch-jobs
         *  - GET  /api/v1/patch-jobs/{patch_job}
         *  - POST /api/v1/patch-jobs/{job}/deploy
         *  - POST /api/v1/patch-jobs/{job}/rollback
         */
        Route::get ('patch-jobs',                 [PatchJobController::class, 'index']);
        Route::post('patch-jobs',                 [PatchJobController::class, 'store']);
        Route::get ('patch-jobs/{patch_job}',     [PatchJobController::class, 'show']);
        Route::post('patch-jobs/{job}/deploy',    [PatchJobController::class, 'deploy']);
        Route::post('patch-jobs/{job}/rollback',  [PatchJobController::class, 'rollback']);

        /**
         * Reports & Audit
         *  - GET /api/v1/reports/change-summary
         *  - GET /api/v1/reports/patch-compliance
         */
        Route::get('reports/change-summary',   [ReportController::class, 'changeSummary']);
        Route::get('reports/patch-compliance',[ReportController::class, 'patchCompliance']);
    });

/**
 * Fallback JSON (API-friendly)
 */
Route::fallback(function () {
    return response()->json(['error' => 'Endpoint not found'], 404);
});
