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
        'role',        // ✅ tambahan
        'opd_id',      // ✅ tambahan
    ];

    /**
     * Kolom yang disembunyikan saat serialisasi (misal: saat return JSON)
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Tipe konversi otomatis untuk kolom tertentu
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * 🔗 Relasi ke tabel OPD (satu user punya satu OPD)
     */
    public function opd()
    {
        return $this->belongsTo(Opd::class);
    }

    /**
     * 🔗 Relasi ke RFC (user bisa jadi requester untuk banyak RFC)
     */
    public function requestedRfcs()
    {
        return $this->hasMany(Rfc::class, 'requester_id');
    }

    /**
     * 🔗 Relasi ke RFC Approval (jika user jadi approver)
     */
    public function approvals()
    {
        return $this->hasMany(RfcApproval::class, 'approver_id');
    }

    /**
     * 🔗 Relasi ke Maintenance Logs (jika user teknisi)
     */
    public function maintenanceLogs()
    {
        return $this->hasMany(MaintenanceLog::class, 'technician_id');
    }

    /**
     * 🔗 Relasi ke Patch Deployment (jika user teknisi)
     */
    public function patchDeployments()
    {
        return $this->hasMany(PatchDeployment::class, 'technician_id');
    }
}
