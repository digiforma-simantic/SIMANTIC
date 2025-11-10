<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConfigurationItem extends Model
{
    protected $fillable = [
        'name',
        'type',
        'owner_opd_id',
        'environment',
        'criticality',
        'status',
        'version',
        'patch_level',
        'risk_level',
    ];

    public function ownerOpd()
    {
        return $this->belongsTo(Opd::class, 'owner_opd_id');
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
