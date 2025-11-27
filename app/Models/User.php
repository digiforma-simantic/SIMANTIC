<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

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

        // tambahan untuk SSO & SIMANTIC
        'sso_id',
        'role',
        'opd_id',
        'is_active',
        'last_login_at',
    ];

    /**
     * Kolom yang disembunyikan saat JSON output
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Casting tipe data
     */
    protected $casts = [
        'last_login_at' => 'datetime',
        'is_active'     => 'boolean',
    ];

    /* -------------------------------------------------------------------
     |  RELASI-RELASI DATA SIMANTIC
     |--------------------------------------------------------------------
     */

    // User → OPD (belongsTo)
    public function opd()
    {
        return $this->belongsTo(Opd::class);
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

    public function isStaff()         { return $this->role === 'staff'; }
    public function isAdminOpd()      { return $this->role === 'admin_opd'; }
    public function isKasi()          { return $this->role === 'kepala_seksi'; }
    public function isKabid()         { return $this->role === 'kepala_bidang'; }
    public function isKadis()         { return $this->role === 'kepala_dinas'; }
    public function isAuditor()       { return $this->role === 'auditor'; }
    public function isDiskominfo()    { return $this->role === 'diskominfo'; }
}
