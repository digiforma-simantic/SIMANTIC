# Service Desk API Integration - Testing Guide

## Endpoint: POST /api/v1/rfc

**Base URL:** `http://localhost:8000/api/v1/rfc`

---

## Request Headers

```http
Content-Type: application/json
Accept: application/json
```

**⚠️ Note:** Endpoint ini **TIDAK memerlukan authentication token**. Service Desk bisa langsung mengirim request tanpa Bearer token.

---

## Request Body Example

### Minimal Request (Required Fields Only)

```json
{
  "rfc_service_id": "SD-2025-001",
  "title": "Upgrade Database Server",
  "priority": "high"
}
```

### Complete Request (All Fields)

```json
{
  "rfc_service_id": "SD-2025-001",
  "title": "Pembaruan Aplikasi E-Kinerja Versi 2.1",
  "description": "Diperlukan pembaruan modul pelaporan kinerja agar sesuai dengan pedoman terbaru BKN. Proses ini akan memakan waktu sekitar 2 jam downtime.",
  "priority": "high",
  "attachments": [
    "https://api-sindra.co.id/storage/rfc/dokumentasi-upgrade.pdf",
    "https://api-sindra.co.id/storage/rfc/approval-surat.jpg",
    "https://api-sindra.co.id/storage/rfc/technical-spec.docx"
  ],
  "requested_at": "2025-12-02 10:45:00",
  "asset_uuid": "uuid-server-ekinerja-prod-01",
  "sso_id": "sso-user-12345"
}
```

### Alternative Field Names (Backward Compatibility)

```json
{
  "rfc_id": "RFC-2025-0001",
  "title": "Migrasi Database ke Cloud",
  "priority": "medium",
  "request_at": "2025-12-02 08:30:00",
  "asset_id": "legacy-asset-id-123",
  "email": "user@example.com"
}
```

---

## Response Example

### Success Response (201 Created)

```json
{
  "status": true,
  "message": "RFC successfully created from Service Desk",
  "data": {
    "id": 1,
    "rfc_service_id": "SD-2025-001",
    "title": "Pembaruan Aplikasi E-Kinerja Versi 2.1",
    "description": "Diperlukan pembaruan modul pelaporan kinerja...",
    "priority": "high",
    "attachments": [
      "https://api-sindra.co.id/storage/rfc/dokumentasi-upgrade.pdf",
      "https://api-sindra.co.id/storage/rfc/approval-surat.jpg"
    ],
    "requested_at": "2025-12-02 10:45:00",
    "asset_uuid": "uuid-server-ekinerja-prod-01",
    "sso_id": "sso-user-12345",
    "created_at": "2025-12-02 11:00:00",
    "updated_at": "2025-12-02 11:00:00"
  }
}
```

### Error Response (422 Validation Failed)

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "title": [
      "The title field is required."
    ],
    "priority": [
      "The priority field is required.",
      "The selected priority is invalid."
    ]
  }
}
```

---

## Field Mapping

| Service Desk Field | SIMANTIC Field | Type | Required | Notes |
|-------------------|----------------|------|----------|-------|
| `rfc_service_id` or `rfc_id` | `rfc_service_id` | string | No | ID dari Service Desk |
| `title` | `title` | string(255) | **Yes** | Judul RFC |
| `description` | `description` | text | No | Deskripsi lengkap |
| `priority` | `priority` | enum | **Yes** | `low`, `medium`, `high` |
| `attachments` | `attachments` | json array | No | Array URL file |
| `requested_at` or `request_at` | `requested_at` | timestamp | No | Tanggal request |
| `asset_uuid` or `asset_id` | `asset_uuid` | string | No | UUID aset terdampak |
| `sso_id` or `email` | `sso_id` | string | No | Identifier user |

---

## Testing with cURL

### Test 1: Minimal Request

```bash
curl -X POST http://localhost:8000/api/v1/rfc \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "rfc_service_id": "SD-2025-TEST-001",
    "title": "Test RFC from Service Desk",
    "priority": "low"
  }'
```

### Test 2: Complete Request

```bash
curl -X POST http://localhost:8000/api/v1/rfc \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "rfc_service_id": "SD-2025-TEST-002",
    "title": "Upgrade Server Production",
    "description": "Upgrade RAM dari 16GB ke 32GB untuk meningkatkan performa aplikasi",
    "priority": "high",
    "attachments": [
      "https://example.com/doc1.pdf",
      "https://example.com/doc2.jpg"
    ],
    "requested_at": "2025-12-02 14:30:00",
    "asset_uuid": "uuid-server-prod-01",
    "sso_id": "sso-teknisi-001"
  }'
```

### Test 3: Using Postman

1. **Method:** POST
2. **URL:** `http://localhost:8000/api/v1/rfc`
3. **Headers:**
   - `Content-Type: application/json`
   - `Accept: application/json`
4. **Body (raw JSON):**
   ```json
   {
     "rfc_service_id": "SD-2025-TEST-003",
     "title": "Maintenance Database Server",
     "description": "Scheduled maintenance untuk optimasi database",
     "priority": "medium",
     "attachments": [
       "https://example.com/maintenance-schedule.pdf"
     ],
     "requested_at": "2025-12-03 09:00:00",
     "asset_uuid": "uuid-db-server-01",
     "sso_id": "sso-dba-001"
   }
   ```

---

## Priority Values

- `low` - Prioritas rendah (tidak urgent)
- `medium` - Prioritas menengah (perlu perhatian)
- `high` - Prioritas tinggi (urgent)

---

## Notes

1. **No Authentication Required:** ✅ Endpoint ini **TIDAK memerlukan token**. Service Desk bisa langsung POST tanpa autentikasi.
2. **Field Flexibility:** API mendukung field name alternatif untuk backward compatibility:
   - `rfc_id` atau `rfc_service_id`
   - `request_at` atau `requested_at`
   - `asset_id` atau `asset_uuid`
   - `email` atau `sso_id`
3. **Attachments Format:** Array of strings (URLs atau file paths)
4. **Timestamp Format:** `YYYY-MM-DD HH:MM:SS` atau ISO 8601 format
5. **Auto Timestamps:** `created_at` dan `updated_at` otomatis di-generate oleh sistem

---

## Integration Checklist

- [ ] Test endpoint dengan minimal request (no token needed!)
- [ ] Test endpoint dengan complete request
- [ ] Verify data masuk ke database (cek phpMyAdmin)
- [ ] Setup error handling di Service Desk untuk response 422
- [ ] Setup success callback di Service Desk untuk response 201
- [ ] Document API integration di Service Desk

---

**Last Updated:** 2025-12-02
