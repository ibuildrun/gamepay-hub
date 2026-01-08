<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    /*
    |--------------------------------------------------------------------------
    | GreenGamePay API
    |--------------------------------------------------------------------------
    |
    | Integration with GreenGamePay for Steam top-up, Telegram Stars,
    | Gift Games, and Gift Cards.
    |
    */

    'greengamepay' => [
        'base_url' => env('GREENGAMEPAY_API_URL', 'https://api.greengamepay.com'),
        'api_token' => env('GREENGAMEPAY_API_TOKEN'),
    ],

    /*
    |--------------------------------------------------------------------------
    | PayPalych Payment API
    |--------------------------------------------------------------------------
    |
    | Integration with PayPalych (pal24.pro) for payment processing.
    | Supports RUB, USD, EUR payments.
    |
    */

    'paypalych' => [
        'base_url' => env('PAYPALYCH_BASE_URL', 'https://pal24.pro'),
        'api_token' => env('PAYPALYCH_API_TOKEN'),
        'shop_id' => env('PAYPALYCH_SHOP_ID'),
        'success_url' => env('PAYPALYCH_SUCCESS_URL'),
        'fail_url' => env('PAYPALYCH_FAIL_URL'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Telegram Bot
    |--------------------------------------------------------------------------
    |
    | Telegram bot for notifications and OAuth.
    |
    */

    'telegram' => [
        'bot_token' => env('TELEGRAM_BOT_TOKEN'),
        'webhook_url' => env('TELEGRAM_WEBHOOK_URL'),
    ],

];
