<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Role;
use App\Models\Dinas;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Kolom yang boleh diisi (sesuai migration)
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'nip',
        'jenis_kelamin',
        'role_id',
        'dinas_id',
        'unit_kerja_id',
        'sso_id',
    ];

    /**
     * Kolom yang disembunyikan saat JSON output
     */
    protected $hidden = [
        'password',
    ];

    /**
     * Casting tipe data
     */
    protected $casts = [];

    /* -------------------------------------------------------------------
     |  RELASI-RELASI DATA SIMANTIC
     |--------------------------------------------------------------------
     */

    // User → OPD (belongsTo)
    public function opd()
    {
        return $this->belongsTo(Dinas::class);
    }

    // User → Dinas (belongsTo via dinas_id)
    public function dinas()
    {
        return $this->belongsTo(Dinas::class, 'dinas_id');
    }

    // User → Role (belongsTo)
    public function roleObj()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    // User sebagai pengaju RFC
    public function requestedRfcs()
    {
        return $this->hasMany(Rfc::class, 'requester_id');
    }

    // User sebagai approver RFC
    public function approvals()
    {
        return $this->hasMany(RfcApproval::class, 'approver_id');
    }

    // User sebagai teknisi untuk Maintenance
    public function maintenanceLogs()
    {
        return $this->hasMany(MaintenanceLog::class, 'technician_id');
    }

    // User sebagai teknisi Patch Deployment
    public function patchDeployments()
    {
        return $this->hasMany(PatchDeployment::class, 'technician_id');
    }

    /* -------------------------------------------------------------------
     |  HELPER ROLE (BIAR MUDAH DIPAKAI DIMANA-MANA)
     |--------------------------------------------------------------------
     */

    public function isStaff()
    {
        return ($this->roleObj?->slug ?? $this->role ?? null) === 'staff';
    }

    public function isAdminOpd()
    {
        return ($this->roleObj?->slug ?? $this->role ?? null) === 'admin_opd';
    }

    public function isKasi()
    {
        return ($this->roleObj?->slug ?? $this->role ?? null) === 'kepala_seksi';
    }

    public function isKabid()
    {
        return ($this->roleObj?->slug ?? $this->role ?? null) === 'kepala_bidang';
    }

    public function isKadis()
    {
        return ($this->roleObj?->slug ?? $this->role ?? null) === 'kepala_dinas';
    }

    public function isAuditor()
    {
        return ($this->roleObj?->slug ?? $this->role ?? null) === 'auditor';
    }

    public function isDiskominfo()
    {
        return ($this->roleObj?->slug ?? $this->role ?? null) === 'diskominfo';
    }
}
