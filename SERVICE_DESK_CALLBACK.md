# Service Desk Callback Integration

## Overview
Sistem ini mengirim callback otomatis ke Service Desk ketika RFC mendapatkan keputusan approval (approved, rejected, atau pending).

## Fitur
- **Otomatis**: Callback dikirim setiap kali approval decision dibuat
- **Non-blocking**: Kegagalan callback tidak menghentikan proses approval
- **Logging**: Semua callback dicatat di log untuk troubleshooting
- **Validasi**: Hanya mengirim callback jika `rfc_service_id` dan `ci_code` tersedia

## Database Schema

### RFC Table - New Fields untuk Callback
```sql
ci_code VARCHAR(255) NULL -- Configuration Item code dari Service Desk
status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' -- Status RFC
config_comment TEXT NULL -- Komentar konfigurasi untuk status pending
```

## Configuration

### 1. Environment Variable
Tambahkan ke file `.env`:
```env
SERVICE_DESK_CALLBACK_URL=https://api-sindra.okkyprojects.com/api/request-changes/callback
```

### 2. Config File
Sudah dikonfigurasi di `config/services.php`:
```php
'service_desk' => [
    'callback_url' => env('SERVICE_DESK_CALLBACK_URL', 'https://api-sindra.okkyprojects.com/api/request-changes/callback'),
]
```

## API Integration

### Incoming: POST /api/v1/rfc
Service Desk mengirim RFC ke sistem kita dengan field:
```json
{
    "rfc_service_id": "SD-2025-001",
    "ci_code": "CI-2025-001",
    "title": "Upgrade Server Production",
    "description": "Perlu upgrade RAM",
    "priority": "high",
    "attachments": ["file1.pdf", "file2.jpg"],
    "requested_at": "2025-12-02 10:00:00",
    "asset_uuid": "uuid-123",
    "sso_id": "sso-user-001"
}
```

**Response:**
```json
{
    "status": true,
    "message": "RFC successfully created from Service Desk",
    "data": {
        "id": 1,
        "rfc_service_id": "SD-2025-001",
        "ci_code": "CI-2025-001",
        "title": "Upgrade Server Production",
        "description": "Perlu upgrade RAM",
        "priority": "high",
        "status": "pending",
        "attachments": ["file1.pdf", "file2.jpg"],
        "requested_at": "2025-12-02 10:00:00",
        "asset_uuid": "uuid-123",
        "sso_id": "sso-user-001",
        "created_at": "2025-12-02 11:00:00",
        "updated_at": "2025-12-02 11:00:00"
    }
}
```

### Outgoing: POST {SERVICE_DESK_CALLBACK_URL}
Sistem kita mengirim callback ke Service Desk setelah approval decision:

#### Payload untuk Status "approved" atau "rejected"
```json
{
    "rfc_service_id": "SD-2025-001",
    "ci_code": "CI-2025-001",
    "status": "approved",
    "sso_id": "user@example.com"
}
```

#### Payload untuk Status "pending" (revise/need_info)
```json
{
    "rfc_service_id": "SD-2025-001",
    "ci_code": "CI-2025-001",
    "status": "pending",
    "sso_id": "user@example.com",
    "config_comment": "Mohon lengkapi dokumentasi teknis"
}
```

## Service Class

### ServiceDeskCallbackService
Location: `app/Services/ServiceDeskCallbackService.php`

**Method:**
```php
public function sendStatus(Rfc $rfc, string $status, ?string $comment = null): bool
```

**Parameters:**
- `$rfc`: RFC model instance
- `$status`: Status approval (approved|rejected|pending)
- `$comment`: Komentar (required untuk status pending)

**Returns:**
- `true`: Callback berhasil dikirim
- `false`: Callback gagal (dicatat di log)

**Validasi:**
- RFC harus memiliki `rfc_service_id` dan `ci_code`
- Status harus salah satu: approved, rejected, pending
- Komentar wajib ada jika status = pending

**Example Usage:**
```php
use App\Services\ServiceDeskCallbackService;

$callbackService = new ServiceDeskCallbackService();

// Approved
$callbackService->sendStatus($rfc, 'approved');

// Rejected
$callbackService->sendStatus($rfc, 'rejected');

// Pending (need more info)
$callbackService->sendStatus($rfc, 'pending', 'Mohon lengkapi dokumentasi');
```

## Integration Flow

### 1. RFC Creation (dari Service Desk)
```
Service Desk → POST /api/v1/rfc → RfcController@store → Database
```

### 2. Approval Process
```
User → ChangeApprovalController@decide
  ↓
1. Create RfcApproval record
2. Update RFC status & config_comment
3. Send callback to Service Desk
4. Send notifications (legacy)
5. Response to user
```

### 3. Decision Mapping
| Approval Decision | RFC Status | Config Comment | Callback Sent |
|------------------|------------|----------------|---------------|
| `approve`        | `approved` | -              | ✓             |
| `reject`         | `rejected` | -              | ✓             |
| `need_info`      | `pending`  | Required       | ✓             |
| `revise`         | `pending`  | Required       | ✓             |

## Error Handling

### Non-blocking Design
Callback failure tidak menghentikan approval process:
```php
// Approval tetap tersimpan meskipun callback gagal
$approval = RfcApproval::create([...]);
$rfc->status = 'approved';
$rfc->save();

// Callback failure hanya dicatat di log
$callbackService->sendStatus($rfc, 'approved'); // Returns false on error
```

### Logging
Semua callback activity dicatat:
```
[INFO] Sending Service Desk callback: {rfc_id} → {status}
[ERROR] Service Desk callback failed: {error message}
```

Check logs di: `storage/logs/laravel.log`

## Testing

### 1. Test API Endpoint
```bash
curl -X POST http://localhost/api/v1/rfc \
  -H "Content-Type: application/json" \
  -d '{
    "rfc_service_id": "SD-TEST-001",
    "ci_code": "CI-TEST-001",
    "title": "Test RFC",
    "description": "Testing callback",
    "priority": "high"
  }'
```

### 2. Test Approval & Callback
```bash
# Login dan approve RFC
# Cek log untuk melihat callback request
tail -f storage/logs/laravel.log | grep "Service Desk callback"
```

### 3. Verify Database
```php
php artisan tinker

// Check RFC status
$rfc = App\Models\Rfc::find(1);
echo $rfc->status; // pending, approved, or rejected
echo $rfc->config_comment;
```

## Troubleshooting

### Callback tidak terkirim
1. **Check RFC data:**
   ```php
   $rfc = App\Models\Rfc::find(1);
   echo $rfc->canSendCallback(); // Must return true
   ```

2. **Check .env:**
   ```bash
   grep SERVICE_DESK .env
   ```

3. **Check logs:**
   ```bash
   tail -100 storage/logs/laravel.log | grep "callback"
   ```

### Timeout errors
Service menggunakan 10 detik timeout. Jika Service Desk lambat:
```php
// Di ServiceDeskCallbackService.php, adjust timeout:
Http::timeout(30) // Increase to 30 seconds
```

### SSL Certificate errors
Jika development environment:
```php
// ONLY for development, add to sendStatus():
Http::withoutVerifying()
    ->timeout(10)
    ->post(...)
```

## Code Reference

### Files Modified
1. `database/migrations/2025_11_08_180952_create_rfc_table.php` - Added ci_code, status, config_comment
2. `app/Models/Rfc.php` - Added new fillable fields, canSendCallback() helper
3. `app/Services/ServiceDeskCallbackService.php` - NEW: Callback service
4. `config/services.php` - Added service_desk configuration
5. `app/Http/Controllers/ChangeApprovalController.php` - Integrated callback
6. `app/Http/Controllers/Api/RfcController.php` - Accept ci_code from Service Desk

### Key Methods
- `Rfc::canSendCallback()`: Check if RFC ready for callback
- `ServiceDeskCallbackService::sendStatus()`: Send callback to Service Desk
- `ChangeApprovalController::decide()`: Main approval flow with callback
- `ChangeApprovalController::mapDecisionToStatus()`: Map approval to RFC status

## Security

### No Authentication Required (Incoming)
POST /api/v1/rfc tidak memerlukan Bearer token karena digunakan oleh Service Desk external.

**Alternative security measures:**
1. IP Whitelist di web server (nginx/apache)
2. API Key di header (future enhancement)
3. Request signature verification (future enhancement)

### Outbound Authentication
Callback ke Service Desk menggunakan HTTP POST tanpa auth. Service Desk harus:
1. Validate payload structure
2. Verify rfc_service_id exists in their system
3. Implement rate limiting

## Future Enhancements

1. **Retry mechanism**: Automatically retry failed callbacks
2. **Queue system**: Use Laravel Queue for async callback
3. **Webhook signature**: Add HMAC signature untuk security
4. **Status tracking**: Track callback delivery status in database
5. **Admin dashboard**: Show callback history and failures
