<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    protected function redirectTo($request): ?string
    {
        // API: jangan redirect ke route login. Biar balas 401 JSON saja.
        return null;
    }
}
