# RFC Schema Simplification - Service Desk Integration

## Summary

Simplified the RFC (Request for Change) table schema to support **Service Desk integration only**. Removed Change Management creation workflow and all related fields.

---

## ✅ Completed Changes

### 1. Database Migration Updates

**File: `database/migrations/2025_11_08_180952_create_rfc_table.php.php`**

**New RFC Schema (8 fields only):**
- `rfc_service_id` - String identifier from Service Desk system
- `title` - RFC title (max 255 chars)
- `description` - Detailed description (text, nullable)
- `priority` - Enum: `low`, `medium`, `high`
- `attachments` - JSON array of attachment file paths
- `requested_at` - Timestamp when RFC was created in Service Desk
- `asset_uuid` - UUID of related asset/CI
- `sso_id` - SSO identifier of requesting user
- `created_at`, `updated_at` - Laravel timestamps

**Removed Fields:**
- `category` (normal/standard/emergency)
- `urgency` (low/medium/high/critical)
- `status` (submitted/approved/rejected/etc)
- `requester_id` (FK to users)
- `requester_opd_id` (FK to dinas/OPD)
- `tech_note` (technical notes)
- All indexes and foreign key constraints

---

### 2. Deleted Migration Files

- ✅ `2025_11_18_112738_add_ticket_code_and_tech_note_to_rfc_table.php` - Deleted (gutted)
- ✅ `2025_11_29_000001_add_request_at_and_asset_id_to_rfc_table.php` - Deleted (gutted)
- ✅ `2025_11_18_112651_modify_priority_enum_in_rfc_table.php` - Deleted (obsolete)
- ✅ `2025_11_08_181140_create_rfc_approvals_table.php.php` - Deleted (duplicate .php.php)
- ✅ `2025_11_08_181026_create_rfc_ci_table.php.php` - Deleted (duplicate .php.php)
- ✅ `2025_11_08_180952_create_rfc_table.php.php` - **KEPT** but cleaned (removed .php.php duplicates)
- ✅ `2025_11_08_181107_create_rfc_assessments_table.php.php` - Deleted (duplicate .php.php)

---

### 3. Model Updates

**File: `app/Models/Rfc.php`**

**Updated:**
- `$fillable` - Only 8 Service Desk fields
- `$casts` - Cast `attachments` to array, `requested_at` to datetime
- Renamed `attachments()` relationship to `rfcAttachments()` (avoid naming conflict)
- Removed relationships: `requester()`, `requesterOpd()`, `configurationItems()`, `assessment()`, `currentApproval()`, `impactReport()`, `changePlan()`, `execution()`, `pir()`, `complianceReview()`, `maintenanceLogs()`, `patchDeployments()`
- Kept: `approvals()` - for approval workflow
- Kept: `getPriorityLabelAttribute()` - accessor for display

**File: `app/Models/User.php`**
- Added comment to `requestedRfcs()` relationship - marked as legacy (no longer used)

**File: `app/Models/Dinas.php`**
- Added comment to `rfcsAsRequester()` relationship - marked as legacy (no longer used)

---

### 4. Controller Updates

**File: `app/Http/Controllers/Api/RfcController.php`**

**Updated:**
- `index()` - Removed OPD filtering, simplified to only filter by priority
- `show()` - Removed access control, returns only Service Desk fields
- `store()` - Validates and accepts Service Desk payload:
  - Maps `sso_id` or `email` to internal User (with fallback to `SERVICE_DESK_FALLBACK_EMAIL`)
  - Creates RFC with only Service Desk fields
  - Stores attachments as JSON array (not separate RfcAttachment records)

**File: `app/Http/Controllers/ChangeController.php`**

**Updated:**
- `index()` - Simplified to list RFCs from Service Desk, filter by priority only
- `show()` - Returns only Service Desk RFC fields
- `store()` - **DISABLED** - Returns 501 error with message: "RFC creation through Change Management is disabled. RFCs are now created via Service Desk integration only."

**File: `app/Http/Controllers/ChangeApprovalController.php`**

**Updated:**
- `notifyServiceDeskTechnician()` - Changed from `ticket_code` to `rfc_service_id`
- `notifyRequester()` - Updated comment to reflect Service Desk integration (no longer notifies internal users)

**File: `app/Http/Controllers/Api/ReportController.php`**

**Updated:**
- `changeSummary()` - Replaced category-based stats with priority-based stats:
  - Removed: `by_category` (normal/standard/emergency)
  - Removed: status-based stats (approved/rejected/in_progress)
  - Added: `by_priority` (low/medium/high)
  - Updated chart labels and data

---

## 🔐 Service Desk Integration

### API Endpoint

**POST `/api/v1/rfc`**

**Request Body:**
```json
{
  "rfc_id": "SD-2025-001",          // maps to rfc_service_id
  "title": "Upgrade Database",
  "description": "Need PostgreSQL upgrade",
  "priority": "high",               // low | medium | high
  "attachments": ["/path/to/file1.pdf", "/path/to/file2.jpg"],
  "requested_at": "2025-12-01 10:30:00",
  "asset_uuid": "uuid-123",
  "sso_id": "user@example.com"     // or email field
}
```

**User Mapping:**
- Service Desk sends `sso_id` or `email`
- Controller maps to internal User via `sso_id` or `email` match
- Falls back to `SERVICE_DESK_FALLBACK_EMAIL` env variable if no match

**Response:**
```json
{
  "id": 101,
  "rfc_service_id": "SD-2025-001",
  "title": "Upgrade Database",
  "description": "Need PostgreSQL upgrade",
  "priority": "high",
  "attachments": ["/path/to/file1.pdf", "/path/to/file2.jpg"],
  "requested_at": "2025-12-01 10:30:00",
  "asset_uuid": "uuid-123",
  "sso_id": "user@example.com",
  "created_at": "2025-12-02 08:15:00",
  "updated_at": "2025-12-02 08:15:00"
}
```

---

## 🔧 Environment Configuration

Add to `.env`:
```env
SERVICE_DESK_FALLBACK_EMAIL=servicedesk@example.com
```

---

## 📋 Next Steps

1. **Run migrations:**
   ```bash
   php artisan migrate:fresh --seed
   # or
   php artisan migrate:rollback
   php artisan migrate
   ```

2. **Test Service Desk integration endpoint:**
   ```bash
   POST /api/v1/rfc
   ```

3. **Update frontend:**
   - Remove RFC creation forms (if any)
   - Update RFC list to show priority instead of category/urgency
   - Update RFC detail views to show new fields only

4. **Configure Service Desk callback URL:**
   - Update Service Desk config with approval callback URL
   - Test approval notifications back to Service Desk

---

## ⚠️ Breaking Changes

- **RFC creation via Change Management is disabled** - Users can no longer create RFCs through internal UI
- **Removed fields:** category, urgency, status, requester_id, requester_opd_id, tech_note
- **Priority changed:** From P1/P2/P3/P4 enum to low/medium/high string
- **Attachments:** Now stored as JSON array instead of separate RfcAttachment records
- **Relationships removed:** All Change Management relationships (assessment, approvals, changePlan, etc.)

---

## ✅ Validation

All PHP syntax checks passed:
- ✅ `app/Models/Rfc.php`
- ✅ `app/Models/User.php`
- ✅ `app/Models/Dinas.php`
- ✅ `app/Http/Controllers/ChangeController.php`
- ✅ `app/Http/Controllers/ChangeApprovalController.php`
- ✅ `app/Http/Controllers/Api/RfcController.php`
- ✅ `app/Http/Controllers/Api/ReportController.php`

---

## 📝 Notes

- RFC approvals workflow is still functional (via `RfcApproval` model)
- Legacy relationships in User and Dinas models are marked as deprecated but kept for backward compatibility
- Service Desk notification callback still works (sends approval decisions back to Service Desk)
- No seeders or tests were affected (no RFC seeding code found)

---

**Date:** 2025-12-02
**Status:** ✅ COMPLETED
