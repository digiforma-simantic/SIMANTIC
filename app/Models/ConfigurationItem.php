<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property string|null $ci_code
 * @property string $type
 * @property int $owner_dinas_id
 * @property string $environment
 * @property string $criticality
 * @property string $status
 * @property string|null $version
 * @property string|null $os_name
 * @property string|null $ip_address
 * @property string|null $relation_note
 * @property string|null $patch_level
 * @property int $risk_level
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class ConfigurationItem extends Model
{
    // Kalau pakai timestamps (created_at / updated_at) biarkan true (default)
    // public $timestamps = true;

    protected $fillable = [
        'name',
        'ci_code',        // kode unik CI, misal: CI-000245
        'type',
        'owner_dinas_id',
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

    public function ownerDinas()
    {
        return $this->belongsTo(Dinas::class, 'owner_dinas_id');
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
