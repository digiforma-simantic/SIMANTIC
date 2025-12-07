<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        'api/*',          // ← penting: semua endpoint /api bebas CSRF
        '/api/*',         // Tambahan untuk memastikan semua API route
        '/api/sso/callback',
        'api/sso/callback',
        '/api/auth/dev/login',  // Explicit untuk dev login
    ];
}
