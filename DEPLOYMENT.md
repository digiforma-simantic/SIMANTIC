# SIMANTIC - Deployment Guide untuk simantic.online

## 🚀 Cara Deploy ke cPanel

### 1. Clone Repository di cPanel Terminal

```bash
cd public_html
git clone https://github.com/digiforma-simantic/SIMANTIC.git .
```

Atau jika sudah ada, pull update:
```bash
cd public_html
git pull origin main
```

### 2. Setup Environment Production

```bash
# Copy .env.production ke .env
cp .env.production .env

# Edit .env sesuai database cPanel
nano .env
```

Update di `.env`:
- `APP_KEY` - Generate dengan: `php artisan key:generate`
- `DB_DATABASE` - Nama database cPanel (misal: `simantic_db`)
- `DB_USERNAME` - Username database cPanel
- `DB_PASSWORD` - Password database cPanel

### 3. Install Dependencies

```bash
# Install Composer dependencies
composer install --no-dev --optimize-autoloader

# Generate application key (jika belum)
php artisan key:generate

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 4. Setup Database

```bash
# Jalankan migrations
php artisan migrate --force

# Seed data development (opsional, untuk testing)
php artisan db:seed --class=DevelopmentSeeder
```

### 5. Set Permissions

```bash
# Set permissions untuk storage dan cache
chmod -R 775 storage bootstrap/cache
chown -R $USER:www-data storage bootstrap/cache
```

### 6. Build Frontend (jika perlu)

Jika ada update frontend, build dulu di lokal:

```bash
cd frontend
npm install
npm run build
```

Lalu upload folder `frontend/dist` ke server, atau setup Node.js di cPanel.

### 7. Setup .htaccess (jika belum ada)

File `.htaccess` di root `public_html`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
    
    # Redirect ke folder public Laravel
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

### 8. Verify Installation

Test endpoint:
- Backend API: `https://simantic.online/api/ping`
- SSO Callback: `https://simantic.online/api/sso/callback`
- Frontend: `https://simantic.online`

---

## 🔧 Update Aplikasi

Setiap ada update dari GitHub:

```bash
cd public_html
git pull origin main
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 🔐 Security Checklist

✅ `APP_ENV=production` di `.env`
✅ `APP_DEBUG=false` di `.env`
✅ `APP_KEY` sudah di-generate
✅ Database credentials aman
✅ File `.env` tidak di-commit ke git
✅ SSL/HTTPS aktif
✅ Session secure cookies enabled

---

## 📝 User Testing (DevelopmentSeeder)

Jika sudah run seeder, user yang tersedia:

- admin.kota@example.com / password
- kepala.dinas@example.com / password
- admin.dinas@example.com / password
- staff@example.com / password
- dll

Login via: `POST https://simantic.online/api/auth/dev/login`

---

## 🆘 Troubleshooting

**Error: 500 Internal Server Error**
- Check `.env` file ada dan valid
- Check permissions: `chmod -R 775 storage bootstrap/cache`
- Check error log: `tail -f storage/logs/laravel.log`

**Error: Database connection**
- Verify DB credentials di `.env`
- Check MySQL service running
- Test connection: `php artisan tinker` → `DB::connection()->getPdo();`

**Error: Route not found**
- Clear cache: `php artisan config:clear && php artisan route:clear`
- Rerun cache: `php artisan config:cache && php artisan route:cache`

**SSO Timeout**
- SSO API eksternal mungkin down
- Gunakan dev login untuk testing: `/api/auth/dev/login`

---

## 📞 Support

Repo: https://github.com/digiforma-simantic/SIMANTIC
Issues: https://github.com/digiforma-simantic/SIMANTIC/issues
