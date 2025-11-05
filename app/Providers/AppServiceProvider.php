<?php

namespace App\Providers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
{
    RateLimiter::for('api', function (Request $request) {
        // user login dapat kuota lebih tinggi, guest pakai IP
        return $request->user()
            ? [Limit::perMinute(120)->by($request->user()->id)]
            : [Limit::perMinute(60)->by($request->ip())];
    });
}

}
