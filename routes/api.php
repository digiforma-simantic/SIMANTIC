<?php
// use App\Http\Controllers\Api\AssetController;
// Route::apiResource('assets', AssetController::class)->only(['index', 'show']);
// Route::post('/assets/sync-external', [AssetController::class, 'syncFromExternal']);
// Route::post('/external-assets/store', [AssetController::class, 'storeFromExternal']);

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\V1\RfcApprovalController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\Auth\DevLoginController;
use App\Http\Controllers\Api\ConfigurationItemController;
use App\Http\Controllers\Api\RfcController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\CmdbController;
use App\Http\Controllers\ChangeController;
use App\Http\Controllers\ChangeApprovalController;
use App\Http\Controllers\Api\LoginController;

// Tambahan modul baru
use App\Http\Controllers\Api\MaintenanceJobController;
use App\Http\Controllers\Api\PatchCatalogController;
use App\Http\Controllers\Api\PatchJobController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Auth\SsoCallbackController;

/**
 * Dev login moved to routes/dev.php (no CSRF)
 */

Route::get('/ping', fn () => response()->json(['message' => 'pong 🏓']))
    ->name('ping');

// SSO Callback - receives token from SSO portal and redirects to frontend
Route::get('sso/callback', [SsoCallbackController::class, 'callback'])->name('sso.callback');
Route::post('sso/callback', [SsoCallbackController::class, 'callbackApi'])->name('sso.callback.api');

// Legacy SSO routes (keep for backward compatibility)
Route::get('sso/token-exchange', [AuthController::class,'SSOCallback'])->name('sso.token-exchange');
Route::get('v1/auth/sso/direct-login', [AuthController::class, 'directLogin'])->name('sso.direct-login');

// Initial setup: Import users without authentication (first time only)
Route::post('v1/setup/import-users', [\App\Http\Controllers\Api\UserImportController::class, 'import'])
    ->name('setup.import-users');

Route::post('/v1/rfc',      [RfcController::class, 'store'])->name('rfc.store');

/**
 * Implementation Report (no auth - called by Service Desk after completion)
 */
Route::post('v1/implementation-reports', [\App\Http\Controllers\Api\ImplementationReportController::class, 'store'])
    ->name('implementation-reports.submit');

/**
 * Approval flow (no auth required - called by Service Desk)
 * Body JSON: { "stage":"kasi|kabid|diskominfo", "decision":"approve|reject|need_info", "note":"..." }
 */
Route::post('v1/rfc/{change}/decisions', [ChangeApprovalController::class, 'decide'])
    ->name('rfc.decisions');
Route::post('v1/rfc/{change}/approve', [ChangeApprovalController::class, 'approve'])
    ->name('rfc.approve');
Route::post('v1/rfc/{change}/reject',  [ChangeApprovalController::class, 'reject'])
    ->name('rfc.reject');

/**
 * Implementation Report (no auth required - called by Service Desk after completion)
 */
Route::post('v1/implementation-reports', [\App\Http\Controllers\Api\ImplementationReportController::class, 'store'])
    ->name('implementation-reports.store');

/**
 * Protected v1 (butuh Bearer token Sanctum)
 * Final path: /api/v1/...
 */
Route::prefix('v1')
    ->middleware(['auth:sanctum', 'throttle:60,1'])
    ->group(function () {

        // Endpoint aset untuk frontend (proxy ke SIPRIMA via backend)
        Route::get('assets', [ConfigurationItemController::class, 'externalAssets']);

        // Debug: cek siapa user yang login (hapus saat production)
        Route::get('me', function (Request $r) {
            $user = $r->user();
            $user->load(['roleObj', 'dinas']);
            return response()->json($user);
        })->name('me');

        // Configuration Items
        Route::apiResource('config-items', ConfigurationItemController::class)
            ->parameters(['config-items' => 'config_item'])
            ->names([
                'index'   => 'config-items.index',
                'store'   => 'config-items.store',
                'show'    => 'config-items.show',
                'update'  => 'config-items.update',
                'destroy' => 'config-items.destroy',
            ]);
        
        Route::patch('config-items/{config_item}/configuration', [ConfigurationItemController::class, 'updateConfiguration'])
            ->name('config-items.update-configuration');

        /**
         * Master Data Import
         */
        // Route::post('import/assets', [\App\Http\Controllers\Api\AssetImportController::class, 'import'])
        //     ->name('import.assets');
        Route::post('import/dinas', [\App\Http\Controllers\Api\DinasImportController::class, 'import'])
            ->name('import.dinas');
        Route::post('import/users', [\App\Http\Controllers\Api\UserImportController::class, 'import'])
            ->name('import.users');

        // Graph/Dependency untuk CI tertentu (masih butuh auth)
        Route::get('config-items/{config_item}/graph', [CmdbController::class, 'show'])
            ->name('config-items.graph');

        // GET ALL RFC
        Route::get('rfc/approvals', [RfcApprovalController::class, 'index'])
            ->name('rfc.approvals'); 

        // RFC Approval Workflow
        Route::get('rfc/pending-approval', [RfcController::class, 'getPendingApprovals'])
            ->name('rfc.pending-approval');
        Route::post('rfc/{rfc}/set', [RfcApprovalController::class, 'set'])
            ->name('rfc.set');
        Route::post('rfc/{id}/approve', [RfcController::class, 'approve'])
            ->name('rfc.approve');
        Route::post('rfc/{id}/forward', [RfcApprovalController::class, 'forward'])
            ->name('rfc.forward');
        Route::get('rfc/history', [RfcController::class, 'getHistory'])
            ->name('rfc.history');
        Route::get('rfc/{id}/detail', [RfcController::class, 'show'])
            ->name('rfc.show');

        /**
         * RFC (Request for Change)
         */
        Route::get('rfc',       [RfcController::class, 'index'])->name('rfc.index');
        Route::get('rfc/{rfc}', [RfcController::class, 'show' ])->name('rfc.show');
        Route::put('rfc/{rfc}', [RfcController::class, 'update' ])->name('rfc.update');

        /**
         * Implementation Reports (internal access)
         */
        Route::get('implementation-reports', [\App\Http\Controllers\Api\ImplementationReportController::class, 'index'])
            ->name('implementation-reports.index');
        Route::get('implementation-reports/{implementationReport}', [\App\Http\Controllers\Api\ImplementationReportController::class, 'show'])
            ->name('implementation-reports.show');

        /**
         * Notifications - staff specific endpoint
         */
        Route::get('notification/staff', [NotificationController::class, 'staff'])->name('notification.staff');

        /**
         * Change Management
         */
        Route::controller(ChangeController::class)->group(function () {
            Route::get ('changes',          'index')->name('changes.index');
            Route::post('changes',          'store')->name('changes.store');
            Route::get ('changes/{change}', 'show' )->name('changes.show');
        });

        /**
         * Maintenance Management
         *  - GET  /api/v1/maintenance-jobs
         *  - POST /api/v1/maintenance-jobs
         *  - GET  /api/v1/maintenance-jobs/{maintenance_job}
         *  - POST /api/v1/maintenance-jobs/{job}/result
         */

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
                /**
                 * Notifications REST (existing endpoints, protected by auth:sanctum)
                 *  - GET  /api/v1/notifications
                 *  - POST /api/v1/notifications/{notification}/read
                 */
                Route::get('notifications', [NotificationController::class, 'index']);
                Route::post('notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
        });

// Login user aplikasi (email & password)
Route::post('auth/login', [LoginController::class, 'login'])->name('auth.login');
Route::post('auth/dev/login', [DevLoginController::class, 'login']);

require __DIR__.'/api/api.php';

/**
 * Fallback JSON (API-friendly)
 */
Route::fallback(function () {
    return response()->json(['error' => 'Endpoint not found'], 404);
});
