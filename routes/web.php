<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\SesiController;
use Illuminate\Support\Facades\Route;

Route::middleware(['guest'])->group(function () {
    Route::get('/', [SesiController::class, 'index'])->name('login');
    Route::post('/', [SesiController::class, 'login']);
});

Route::get('/home', function () {
    return redirect('/opd');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/opd', [AdminController::class, 'index']);
    Route::get('/opd/staff', [AdminController::class, 'staff'])->middleware('userAkses:staff');
    Route::get('/opd/admin', [AdminController::class, 'admin'])->middleware('userAkses:admin');
    Route::get('/opd/kepala_seksi', [AdminController::class, 'kepala_seksi'])->middleware('userAkses:kepala_seksi');
    Route::get('/opd/kepala_bidang', [AdminController::class, 'kepala_bidang'])->middleware('userAkses:kepala_bidang');
    Route::get('/opd/kepala_dinas', [AdminController::class, 'kepala_dinas'])->middleware('userAkses:kepala_dinas');
    Route::get('/opd/diskominfo', [AdminController::class, 'diskominfo'])->middleware('userAkses:diskominfo');
    Route::get('/opd/auditor', [AdminController::class, 'auditor'])->middleware('userAkses:auditor');
    Route::get('/logout', [SesiController::class, 'logout']);
});