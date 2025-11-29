<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConfigurationItem extends Model
{
    // Kalau pakai timestamps (created_at / updated_at) biarkan true (default)
    // public $timestamps = true;

    protected $fillable = [
        'name',
        'ci_code',        // kode unik CI, misal: CI-000245
        'type',
        'owner_opd_id',
        'environment',
        'criticality',
        'status',
        'version',        // contoh: Firmware BIOS v1.14.2
        'os_name',        // contoh: Windows 11 Pro 64-bit
        'ip_address',     // contoh: 10.10.5.123
        'relation_note',  // deskripsi relasi antar aset
        'patch_level',
        'risk_level',
    ];

    /* ==========================
     *  RELATIONSHIPS
     * ========================== */

    public function ownerOpd()
    {
        return $this->belongsTo(Dinas::class, 'owner_opd_id');
    }

    public function risks()
    {
        return $this->hasMany(RiskRegister::class, 'ci_id');
    }

    public function rfcs()
    {
        return $this->belongsToMany(Rfc::class, 'rfc_ci', 'ci_id', 'rfc_id');
    }

    public function sourceRelations()
    {
        return $this->hasMany(CiRelation::class, 'source_ci_id');
    }

    public function targetRelations()
    {
        return $this->hasMany(CiRelation::class, 'target_ci_id');
    }

    public function patchDeployments()
    {
        return $this->hasMany(PatchDeployment::class, 'ci_id');
    }
}
