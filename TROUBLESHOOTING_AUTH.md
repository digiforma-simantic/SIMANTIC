# 🔧 Troubleshooting Authentication Error

## Error: "Unauthenticated"

Error ini muncul karena backend Laravel tidak bisa memverifikasi token autentikasi.

---

## 🔍 Cara Debugging

### 1. **Buka test_auth.html di Browser**
```bash
# File sudah dibuat di: C:\Users\sandr\Simantic\SIMANTIC\test_auth.html
# Buka dengan double-click atau via browser
```

### 2. **Test Login Flow**

**Step 1: Login Dulu**
- Buka test_auth.html
- Isi Email: `admin@example.com` (atau email user yang ada di database)
- Isi Password: `password` (sesuai database)
- Klik "Test Login"
- **✅ Jika berhasil:** Token akan disimpan di localStorage
- **❌ Jika gagal:** Cek apakah user exist di database

**Step 2: Test Token Valid**
- Setelah login, klik "Test /api/v1/me"
- **✅ Jika berhasil:** Token valid, lanjut ke step 3
- **❌ Jika gagal:** Token invalid atau expired

**Step 3: Test Get Config Items**
- Klik "Test GET /api/v1/config-items"
- **✅ Jika berhasil:** API authentication work
- **❌ Jika gagal:** Cek error message

**Step 4: Test Get by ID**
- Pastikan ada data configuration_items di database
- Isi ID (contoh: 1)
- Klik "Test GET /api/v1/config-items/{id}"

---

## 🛠️ Solusi Masalah Umum

### Problem 1: User Belum Ada di Database
**Gejala:** Login gagal dengan error "Invalid credentials"

**Solusi:** Create user via artisan tinker
```bash
php artisan tinker

# Create admin user
$user = new \App\Models\User();
$user->name = 'Admin Test';
$user->email = 'admin@example.com';
$user->password = bcrypt('password');
$user->role = 'admin';
$user->opd_id = 1; // Sesuaikan dengan OPD yang ada
$user->save();

exit
```

### Problem 2: Token Tidak Tersimpan
**Gejala:** Setelah login, token tidak ada di localStorage

**Solusi:** Cek response dari endpoint login
```javascript
// Di browser console
fetch('http://127.0.0.1:8000/api/auth/dev/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ email: 'admin@example.com', password: 'password' })
})
.then(r => r.json())
.then(d => console.log(d));
```

### Problem 3: CORS Error
**Gejala:** Browser console menampilkan "CORS policy blocked"

**Solusi:** Update `config/cors.php`
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:5173', 'http://127.0.0.1:5173'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

### Problem 4: Laravel Backend Tidak Berjalan
**Gejala:** Error "Failed to fetch" atau "Connection refused"

**Solusi:** Start Laravel server
```bash
cd C:\Users\sandr\Simantic\SIMANTIC
php artisan serve
# Pastikan running di http://127.0.0.1:8000
```

### Problem 5: Database Kosong (No Configuration Items)
**Gejala:** GET /config-items berhasil tapi return array kosong

**Solusi 1: Import dari Asset API**
```bash
# Via test_auth.html
# 1. Login dulu
# 2. Buka browser console
# 3. Jalankan:

fetch('http://127.0.0.1:8000/api/v1/import/assets', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({})
})
.then(r => r.json())
.then(d => console.log(d));
```

**Solusi 2: Create Manual via Tinker**
```bash
php artisan tinker

$ci = new \App\Models\ConfigurationItem();
$ci->name = 'Test Laptop';
$ci->type = 'workstation';
$ci->owner_opd_id = 1;
$ci->environment = 'production';
$ci->criticality = 'medium';
$ci->status = 'active';
$ci->ci_code = 'CI-000001';
$ci->save();

exit
```

---

## 📝 Checklist Debug

- [ ] Laravel backend running (`php artisan serve`)
- [ ] Database connection OK
- [ ] User exist di database
- [ ] Login berhasil dapat token
- [ ] Token tersimpan di localStorage
- [ ] Token valid (test via /api/v1/me)
- [ ] Configuration items ada di database
- [ ] Frontend bisa fetch data CI

---

## 🚀 Testing FormDetailAset.jsx

Setelah semua checklist OK:

1. **Login dulu** via aplikasi atau test_auth.html
2. **Buka FormDetailAset** dengan URL yang benar:
   ```
   http://localhost:5173/FormDetailAset/1
   ```
   (Ganti 1 dengan ID configuration_item yang ada)

3. **Check Browser Console** untuk log:
   - Token from localStorage: EXISTS/NOT FOUND
   - Fetching CI with ID: X
   - API Request Headers
   - API Response Status

4. **Jika masih error "Unauthenticated":**
   - Cek Network tab di DevTools
   - Pastikan request header ada: `Authorization: Bearer <token>`
   - Cek response dari API (bisa jadi token expired)

---

## 💡 Tips

1. **Token expires setelah beberapa waktu** - Perlu login ulang
2. **Gunakan test_auth.html** untuk test tanpa frontend
3. **Check browser console** selalu untuk log errors
4. **Gunakan Network tab** di DevTools untuk inspect request/response

---

## 📞 Next Steps

Jika masih error:
1. Screenshot error di browser console
2. Screenshot Network tab (request headers + response)
3. Check Laravel logs: `storage/logs/laravel.log`
