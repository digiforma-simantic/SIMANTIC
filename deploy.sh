#!/bin/bash

# SIMANTIC Deployment Script for cPanel
# Run this in cPanel Terminal after git pull

echo "🚀 SIMANTIC Deployment Script"
echo "================================"

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Creating .env from template..."
    
    cat > .env << 'EOF'
APP_NAME=SIMANTIC
APP_ENV=production
APP_KEY=base64:QsKFDs9DtW0jDd1ONAW5MYGRsArO9UmqiKRx2iU161w=
APP_DEBUG=false

# Backend SIMANTIC Production
APP_URL=https://api.simantic.online
VITE_API_BASE_URL=https://api.simantic.online

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file
PHP_CLI_SERVER_WORKERS=4
BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=simantic_api
DB_USERNAME=simantic_user
DB_PASSWORD="U&w}05m}OWA#DD%L"

SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

CACHE_STORE=file
QUEUE_CONNECTION=sync

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local

MEMCACHED_HOST=127.0.0.1

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=log
MAIL_SCHEME=null
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

L5_SWAGGER_CONST_HOST=https://api.simantic.online

VITE_APP_NAME="${APP_NAME}"

# SSO Configuration
SSO_BASE_URL=https://sso-mitra.contoh.go.id
SSO_CLIENT_ID=simantic-app
SSO_CLIENT_SECRET=H62$ajd8Lsj88@!sd7asdlkjASD72hks^2
SSO_REDIRECT_URI=https://api.simantic.online/api/v1/auth/sso/callback

# Frontend URL untuk redirect SSO callback
FRONTEND_URL=https://simantic.online

# SSO API Integration
SSO_API_BASE_URL=https://api.bispro.digitaltech.my.id
SSO_API_TOKEN=7|wjIAUE9TaIAd8Tqvkq5tdFe69w0Y8Xcsmqeub9sp6fa2ab51

# Service Desk Integration
SERVICE_DESK_FALLBACK_EMAIL=service.desk@example.com
SERVICE_DESK_CALLBACK_URL=https://api-sindra.okkyprojects.com/api/request-changes/callback

# Sanctum Configuration
SANCTUM_STATEFUL_DOMAINS=simantic.online,api.simantic.online
EOF

    echo "✅ .env file created!"
else
    echo "✅ .env file exists"
fi

# Install dependencies
echo ""
echo "📦 Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader

# Run migrations
echo ""
echo "🗄️  Running database migrations..."
php artisan migrate --force

# Clear and cache config
echo ""
echo "🔧 Caching configuration..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions
echo ""
echo "🔒 Setting permissions..."
chmod -R 775 storage bootstrap/cache

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your application is ready at:"
echo "   Backend API: https://api.simantic.online"
echo "   Frontend: https://simantic.online"
echo ""
echo "📝 Test endpoints:"
echo "   - https://api.simantic.online/api/ping"
echo "   - https://api.simantic.online/api/documentation"
echo ""
