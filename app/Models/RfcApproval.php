<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RfcApproval extends Model
{
    protected $table = 'rfc_approvals';

    protected $fillable = [
        'rfc_id',
        'level',
        'approver_id',
        'decision',
        'reason',
        'decided_at',
    ];

    public function rfc()
    {
        return $this->belongsTo(Rfc::class, 'rfc_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approver_id');
    }
}
