<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ConfigurationItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'ci_code',
        'name',
        'type',
        'owner',
        'status',
        'attributes',
    ];

    protected $casts = [
        'attributes' => 'array',
    ];

    /**
     * Auto generate ci_code kalau kosong
     */
    protected static function booted()
    {
        static::creating(function ($m) {
            if (empty($m->ci_code)) {
                $m->ci_code = 'CI-' . now()->format('YmdHis') . '-' . Str::upper(Str::random(4));
            }
        });
    }

    /**
     * Relasi: CI ini bergantung pada CI lain (relasi keluar)
     */
    public function outgoingRelations()
    {
        return $this->hasMany(CiRelation::class, 'source_ci_id');
    }

    /**
     * Relasi: CI ini dibutuhkan oleh CI lain (relasi masuk)
     */
    public function incomingRelations()
    {
        return $this->hasMany(CiRelation::class, 'target_ci_id');
    }
}
