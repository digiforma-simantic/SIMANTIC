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
