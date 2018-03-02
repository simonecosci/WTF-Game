<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Stripe, Mailgun, SparkPost and others. This file provides a sane
    | default location for this type of information, allowing packages
    | to have a conventional place to find your various credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
    ],

    'ses' => [
        'key' => env('SES_KEY'),
        'secret' => env('SES_SECRET'),
        'region' => 'us-east-1',
    ],

    'sparkpost' => [
        'secret' => env('SPARKPOST_SECRET'),
    ],

    'stripe' => [
        'model' => App\User::class,
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
    ],
    
    'facebook' => [
        'client_id' => '152452958776176',
        'client_secret' => '29a5667e23ba1860fa7b74585984b36b',
        'redirect' => config('app.url') . '/callback/facebook',
    ],
    'twitter' => [
        'client_id' => 't8Mx8sOEDAEfEcqojthOQseUm',
        'client_secret' => 'FdwbywLcKitzAG4uvMXkXHaYcfdSmYjvbsiCLU9ExmZTBiOgU9',
        'redirect' => config('app.url') . '/callback/twitter',
    ],
    'google' => [
        'client_id' => '766273638890-v5u9dkth451rfgrof5bpo2er2pojlb0a.apps.googleusercontent.com',
        'client_secret' => 'KtKOQqCr0bmhiGhDhyGplvBN',
        'redirect' => config('app.url') . '/callback/google',
    ],
];
