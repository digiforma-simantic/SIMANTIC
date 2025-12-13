<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/api/documentation'); // atau teks biasa
});

// Route test log manual untuk debug Laravel log di Windows
if (file_exists(base_path('routes/logtest.php'))) {
    require base_path('routes/logtest.php');
}