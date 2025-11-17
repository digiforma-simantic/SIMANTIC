<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticated
{
    public function handle(Request $request, Closure $next)
    {
        // Jika user sudah login
        if (Auth::check()) {
            // Arahkan ke dashboard atau route lain
            return redirect('/opd');
        }

        return $next($request);
    }
}