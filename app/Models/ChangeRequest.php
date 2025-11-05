<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChangeRequest extends Model
{
    // ✅ PAKAI BIGINT AUTO-INCREMENT (default Eloquent)
    //   -> jangan set $incrementing=false atau $keyType='string'

    // ❌ jangan masukkan 'id' ke fillable
    protected $fillable = [
        'requester_id',
        'dinas_id',
        'title',
        'type',
        'status',
        'description',
        'impact_desc',
        'rollback_plan',
        'schedule_start',
        'schedule_end',
        'risk_score',
    ];

    protected $casts = [
        'schedule_start' => 'datetime',
        'schedule_end'   => 'datetime',
    ];

    /** Relasi ke approvals */
    public function approvals()
    {
        return $this->hasMany(ChangeApproval::class, 'change_id');
    }

    /** CI terdampak via pivot change_request_ci */
    public function cis()
    {
        return $this->belongsToMany(
            ConfigurationItem::class,
            'change_request_ci',
            'change_id',
            'ci_id'
        )->withPivot('impact_level')
         ->withTimestamps();
    }
}
