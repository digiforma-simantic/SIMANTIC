# SSO Integration Documentation

## Overview

SIMANTIC terintegrasi dengan SSO Portal Pemerintah Kota (https://api.bispro.digitaltech.my.id).

User login sekali di SSO Portal, lalu bisa akses semua aplikasi termasuk SIMANTIC tanpa login ulang.

## SSO Login Flow

```
1. User buka SSO Portal → https://api.bispro.digitaltech.my.id
2. User login dengan email & password
3. SSO Portal tampilkan menu aplikasi yang bisa diakses:
   - Asset Management (SIPRIMA)
   - Change Management (SIMANTIC) ← aplikasi kita
   - Service Desk (SINDRA)
4. User klik "Change Management"
5. SSO redirect ke: https://simantic.online/api/sso/callback?token=xxx
6. SIMANTIC verifikasi token ke SSO API
7. SIMANTIC create/update user di local database
8. SIMANTIC generate Sanctum token
9. SIMANTIC redirect ke frontend: http://localhost:5173/sso/callback?token=yyy
10. Frontend simpan token di localStorage
11. User sudah login!
```

## API Endpoints

### 1. SSO Callback (GET) - Redirect ke Frontend
**Route:** `GET /api/sso/callback?token={sso_token}`

Digunakan oleh SSO Portal untuk redirect user setelah login.

**Flow:**
- Verify token dengan SSO API `/api/v2/auth/me`
- Sync user data ke local database
- Generate Sanctum token
- Redirect ke frontend dengan token baru

**Response:** HTTP 302 Redirect ke `{FRONTEND_URL}/sso/callback?token={sanctum_token}`

### 2. SSO Callback API (POST) - Return JSON
**Route:** `POST /api/sso/callback`

Untuk testing SSO login via API (tidak redirect).

**Request Body:**
```json
{
  "token": "7|wjIAUE9TaIAd8Tqvkq5tdFe69w0Y8Xcsmqeub9sp6fa2ab51"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login SSO berhasil",
  "data": {
    "token": "1|abc123...",
    "user": {
      "id": 1,
      "name": "Admin Kota",
      "email": "admin.kota@example.com",
      "nip": "198501012010011001",
      "role": "admin_kota",
      "dinas": null
    }
  }
}
```

## SSO API Reference

### Base URL
```
https://api.bispro.digitaltech.my.id
```

### 1. Login ke SSO
**Endpoint:** `POST /api/v2/auth/login`

**Request:**
```json
{
  "email": "admin.kota@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "7|wjIAUE9TaIAd8Tqvkq5tdFe69w0Y8Xcsmqeub9sp6fa2ab51",
    "user": {
      "id": 1,
      "name": "Admin Kota",
      "email": "admin.kota@example.com",
      "nip": "198501012010011001",
      "jenis_kelamin": "laki-laki",
      "role": "admin_kota",
      "dinas": null,
      "unit_kerja": "Sekretariat Kota",
      "email_verified_at": "2025-12-04 11:16:21"
    },
    "menu": [
      {
        "name": "Asset Management",
        "url": "https://api.siprima.digitaltech.my.id/api/sso/callback?token=...",
        "logo": "siprima.png",
        "description": "Aset Management System"
      },
      {
        "name": "Change Management",
        "url": "https://simantic.online/api/sso/callback?token=...",
        "logo": "simantic.png",
        "description": "Change & Configuration Management"
      }
    ]
  }
}
```

### 2. Verify Token
**Endpoint:** `GET /api/v2/auth/me`

**Headers:**
```
Authorization: Bearer 7|wjIAUE9TaIAd8Tqvkq5tdFe69w0Y8Xcsmqeub9sp6fa2ab51
Accept: application/json
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Admin Kota",
    "email": "admin.kota@example.com",
    "nip": "198501012010011001",
    "jenis_kelamin": "laki-laki",
    "role": "admin_kota",
    "dinas": null,
    "unit_kerja": "Sekretariat Kota"
  }
}
```

### 3. Get All Users
**Endpoint:** `GET /api/v2/auth/users`

**Headers:**
```
Authorization: Bearer 7|wjIAUE9TaIAd8Tqvkq5tdFe69w0Y8Xcsmqeub9sp6fa2ab51
```

**Response:** Array of users (lihat data di chat sebelumnya)

### 4. Get Dinas List
**Endpoint:** `GET /api/v2/master/dinas`

**Headers:**
```
Authorization: Bearer 7|wjIAUE9TaIAd8Tqvkq5tdFe69w0Y8Xcsmqeub9sp6fa2ab51
```

## User Data Mapping

| SSO Field | SIMANTIC Field | Notes |
|-----------|---------------|-------|
| `id` | `sso_id` | SSO user ID |
| `name` | `name` | - |
| `email` | `email` | Unique identifier |
| `nip` | `nip` | - |
| `jenis_kelamin` | `jenis_kelamin` | - |
| `role` | `role_id` | Mapped to roles table |
| `dinas` | `dinas_id` | Mapped to dinas table |
| `unit_kerja` | `unit_kerja` | String field |
| - | `password` | NULL for SSO users |

## Configuration

### Environment Variables

Add to `.env`:
```env
# Frontend URL for SSO redirect
FRONTEND_URL=http://localhost:5173

# SSO API (optional - already hardcoded)
SSO_API_URL=https://api.bispro.digitaltech.my.id
SSO_API_TOKEN=7|wjIAUE9TaIAd8Tqvkq5tdFe69w0Y8Xcsmqeub9sp6fa2ab51
```

## Testing SSO Integration

### Option 1: Via SSO Portal (Production Flow)
1. Buka https://api.bispro.digitaltech.my.id
2. Login dengan kredensial SSO
3. Klik menu "Change Management"
4. Otomatis redirect ke SIMANTIC dengan token

### Option 2: Via API (Development)
```bash
# 1. Login ke SSO
curl -X POST https://api.bispro.digitaltech.my.id/api/v2/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin.kota@example.com","password":"password"}'

# 2. Gunakan token untuk callback SIMANTIC
curl -X POST http://127.0.0.1:8000/api/sso/callback \
  -H "Content-Type: application/json" \
  -d '{"token":"7|wjIAUE9TaIAd8Tqvkq5tdFe69w0Y8Xcsmqeub9sp6fa2ab51"}'
```

### Option 3: Dev Login (Bypass SSO)
Untuk development tanpa SSO:
```bash
curl -X POST http://127.0.0.1:8000/api/auth/dev/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin.kota@example.com","password":"password"}'
```

## Frontend Implementation

Create `frontend/src/pages/SsoCallback.jsx`:

```jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function SsoCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    // Save token to localStorage
    localStorage.setItem('token', token);
    
    // Verify token works
    fetch('http://127.0.0.1:8000/api/v1/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus('success');
          // Redirect to dashboard after 1 second
          setTimeout(() => navigate('/dashboard'), 1000);
        } else {
          setStatus('error');
          setTimeout(() => navigate('/login'), 3000);
        }
      })
      .catch(() => {
        setStatus('error');
        setTimeout(() => navigate('/login'), 3000);
      });
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-center text-gray-600">Memproses login SSO...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="text-green-600 text-6xl text-center">✓</div>
            <p className="mt-4 text-center text-gray-600">Login berhasil! Mengarahkan ke dashboard...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="text-red-600 text-6xl text-center">✗</div>
            <p className="mt-4 text-center text-gray-600">Login gagal. Mengarahkan ke halaman login...</p>
          </>
        )}
      </div>
    </div>
  );
}
```

Add route in `frontend/src/App.jsx`:
```jsx
import SsoCallback from './pages/SsoCallback';

// ... in routes
<Route path="/sso/callback" element={<SsoCallback />} />
```

## Troubleshooting

### Error: "Unable to connect to SSO API"
SSO API mungkin down atau unreachable. Gunakan Dev Login untuk bypass.

### Error: "Token SSO tidak valid"
Token sudah expired (umur token di SSO biasanya 1-2 jam). Login ulang di SSO Portal.

### Error: "User tidak ditemukan"
User belum ada di database. Import users dulu dengan:
```bash
php artisan db:seed --class=DevelopmentSeeder
```

## Security Notes

1. **Token Expiry**: SSO token memiliki expiry time. SIMANTIC token (Sanctum) juga bisa di-set expiry nya.
2. **HTTPS Required**: Di production, pastikan menggunakan HTTPS untuk semua API calls.
3. **CORS**: Pastikan CORS sudah di-configure untuk allow request dari SSO domain.
4. **Token Storage**: Frontend menyimpan token di localStorage. Pertimbangkan httpOnly cookies untuk security lebih baik.

## Related Files

- Controller: `app/Http/Controllers/Auth/SsoCallbackController.php`
- Routes: `routes/api.php` (lines with `sso/callback`)
- Models: `app/Models/User.php`, `app/Models/Role.php`, `app/Models/Dinas.php`
- Seeder: `database/seeders/DevelopmentSeeder.php`
- Config: `.env` (FRONTEND_URL)
