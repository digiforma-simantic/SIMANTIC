<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\DevLoginController;

/**
 * Dev routes - NO CSRF, NO WEB MIDDLEWARE
 * Pure API routes for development only
 */
Route::post('/auth/dev/login', [DevLoginController::class, 'login'])->name('dev.login');
