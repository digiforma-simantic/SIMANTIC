<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatchCatalog extends Model
{
    protected $table = 'patch_catalogs';

    protected $fillable = [
        'code',             // ID patch dari vendor
        'name',
        'description',
        'vendor',
        'severity',         // low/medium/high/critical
        'release_date',
        'supersedes',       // optional: patch code lama
    ];

    public function deployments()
    {
        return $this->hasMany(PatchDeployment::class, 'patch_catalog_id');
    }
}
