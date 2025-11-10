<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChangeExecution extends Model
{
    protected $table = 'change_executions';

    protected $fillable = [
        'rfc_id',
        'executed_by',       // FK ke users.id
        'started_at',
        'ended_at',
        'status',            // planned, in_progress, succeeded, failed, rolled_back
        'rollback_used',     // boolean
        'notes',
    ];

    public function rfc()
    {
        return $this->belongsTo(Rfc::class, 'rfc_id');
    }

    public function executor()
    {
        return $this->belongsTo(User::class, 'executed_by');
    }
}
