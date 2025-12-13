
<?php

return [
    'siprima' => [
        'assets_url' => env('SIPRIMA_ASSETS_URL', 'https://api.siprima.digitaltech.my.id/api/assets'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'service_desk' => [
        'callback_url' => env('SERVICE_DESK_CALLBACK_URL', 'https://api-sindra.okkyprojects.com/api/request-changes/callback'),
    ],

    'asset_api' => [
        'url' => env('ASSET_API_URL', 'https://api.siprima.digitaltech.my.id/api/assets'),
        'token' => env('ASSET_API_TOKEN'),
    ],
];
