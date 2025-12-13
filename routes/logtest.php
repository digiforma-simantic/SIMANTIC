<?php
// Route test log manual untuk debug Laravel log di Windows
use Illuminate\Support\Facades\Log;

Route::get('/logtest', function() {
    Log::info('Log test berhasil!');
    Log::error('Log error test!');
    return 'Log test done';
});
