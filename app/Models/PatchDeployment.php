<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatchDeployment extends Model
{
    protected $table = 'patch_deployments';

    protected $fillable = [
        'patch_catalog_id',
        'ci_id',
        'rfc_id',
        'deployed_by',      // FK ke users.id
        'status',           // planned, in_progress, succeeded, failed, rolled_back
        'deployed_at',
        'rolled_back_at',
        'notes',
    ];

    public function patch()
    {
        return $this->belongsTo(PatchCatalog::class, 'patch_catalog_id');
    }

    public function configurationItem()
    {
        return $this->belongsTo(ConfigurationItem::class, 'ci_id');
    }

    public function rfc()
    {
        return $this->belongsTo(Rfc::class, 'rfc_id');
    }

    public function deployer()
    {
        return $this->belongsTo(User::class, 'deployed_by');
    }
}
