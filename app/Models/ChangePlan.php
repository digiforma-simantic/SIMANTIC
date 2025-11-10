<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChangePlan extends Model
{
    protected $table = 'change_plans';

    protected $fillable = [
        'rfc_id',
        'plan_start_at',
        'plan_end_at',
        'implementation_steps',
        'rollback_plan',
        'communication_plan',
        'resources',
    ];

    public function rfc()
    {
        return $this->belongsTo(Rfc::class, 'rfc_id');
    }
}
