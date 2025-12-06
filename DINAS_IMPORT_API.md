# 🏢 Dinas/OPD Import dari SSO API

## Overview

Fitur ini meng-sync data Dinas/OPD dari SSO API ke database lokal SIMANTIC.

## API Endpoint

**POST** `/api/v1/import/dinas`

**Authentication:** Bearer Token (Sanctum)

**Request:**
```json
{}
```

**Response:**
```json
{
  "success": true,
  "imported": 5,
  "updated": 3,
  "total": 8,
  "errors": [],
  "message": "Import completed: 5 created, 3 updated"
}
```

## Source API

**SSO API:** `https://api.bispro.digitaltech.my.id/api/v2/master/dinas`

**Response Format:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Dinas Komunikasi dan Informatika",
      "address": "Jl. Jimerto No. 25-27, Surabaya",
      "created_at": "2025-12-04T11:16:20.000000Z",
      "updated_at": "2025-12-04T11:16:20.000000Z"
    }
  ]
}
```

## Database Schema

**Table:** `opd`

**New Column:** `sso_dinas_id` (BIGINT, nullable, indexed)

Kolom ini menyimpan `id` dari SSO untuk mapping data.

## Type Mapping

Service akan otomatis map tipe dinas berdasarkan nama:

- Nama mengandung "diskominfo" atau "komunikasi dan informatika" → `type: diskominfo`
- Nama mengandung "badan" → `type: badan`
- Lainnya → `type: dinas`

## Migration

```bash
php artisan migrate
```

Migration file: `2025_12_05_160905_add_sso_dinas_id_to_opd_table.php`

## Usage

### Via API (Postman/cURL)

```bash
curl -X POST http://127.0.0.1:8000/api/v1/import/dinas \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{}'
```

### Via test_auth.html

1. Login dulu untuk dapat token
2. Klik tombol **"Test POST /api/v1/import/dinas"**
3. Lihat hasil import di result area

### Via Frontend (JavaScript)

```javascript
import { assetImportAPI } from '../../services/api';

async function handleImportDinas() {
  try {
    const result = await assetImportAPI.importDinas();
    
    console.log(`Imported: ${result.imported}`);
    console.log(`Updated: ${result.updated}`);
    console.log(`Total: ${result.total}`);
    
    if (result.errors.length > 0) {
      console.error('Errors:', result.errors);
    }
  } catch (error) {
    console.error('Import failed:', error.message);
  }
}
```

## Auto-sync Strategy

**Option 1: Manual Trigger**
- Admin klik button "Sync Dinas" di admin panel
- Import on-demand

**Option 2: Scheduled Task**
```php
// app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    // Sync dinas setiap hari jam 2 pagi
    $schedule->call(function () {
        $service = new \App\Services\DinasImportService();
        $service->importFromSsoApi();
    })->dailyAt('02:00');
}
```

**Option 3: Webhook**
- SSO mengirim webhook saat ada perubahan data dinas
- SIMANTIC trigger import otomatis

## Flow

```
SSO API
  ↓ GET /api/v2/master/dinas
SIMANTIC Backend (DinasImportService)
  ↓ Parse & Map data
  ↓ Check if exists (by sso_dinas_id)
Database (opd table)
  ↓ Create new or Update existing
Response
  → Statistics (imported, updated, errors)
```

## Files Created/Modified

**New Files:**
- `app/Services/DinasImportService.php` - Service untuk import logic
- `app/Http/Controllers/Api/DinasImportController.php` - Controller endpoint
- `database/migrations/2025_12_05_160905_add_sso_dinas_id_to_opd_table.php` - Migration

**Modified Files:**
- `app/Models/Dinas.php` - Added `sso_dinas_id` to fillable
- `routes/api.php` - Added POST /api/v1/import/dinas route
- `frontend/src/services/api.js` - Added importDinas() method
- `test_auth.html` - Added test button for import dinas

## Benefits

✅ **Single Source of Truth** - Data dinas dari SSO
✅ **Auto Sync** - Tidak perlu input manual
✅ **Update Detection** - Otomatis update data yang berubah
✅ **Error Handling** - Track errors per-dinas
✅ **Statistics** - Tahu berapa record imported/updated

## Next Steps

1. **Run migration** (setelah MySQL running)
2. **Test import** via test_auth.html
3. **Verify data** di database table `opd`
4. **Integrate UI** - Tambahkan button "Sync Dinas" di admin panel
5. **Schedule** - Setup cron job untuk auto-sync
