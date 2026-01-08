<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use App\Services\PayPalychService;
use App\Services\GreenGamePayService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register PayPalych service as singleton
        $this->app->singleton(PayPalychService::class, function ($app) {
            return new PayPalychService(
                config('services.paypalych.api_key'),
                config('services.paypalych.shop_id')
            );
        });

        // Register GreenGamePay service as singleton
        $this->app->singleton(GreenGamePayService::class, function ($app) {
            return new GreenGamePayService(
                config('services.greengamepay.api_key')
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Force HTTPS in production
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }
    }
}
