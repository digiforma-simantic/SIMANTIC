<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rfc extends Model
{
    protected $table = 'rfc';

    protected $fillable = [
        'rfc_service_id',
        'title',
        'description',
        'priority',          // low | medium | high
        'attachments',
        'requested_at',
        'asset_uuid',
        'sso_id',
    ];

    protected $casts = [
        'attachments' => 'array',
        'requested_at' => 'datetime',
    ];

    // Legacy relationships - kept for backward compatibility with Change Management features
    // Note: RFC is now Service Desk only and does not store requester_id or requester_opd_id
    
    public function approvals()
    {
        return $this->hasMany(RfcApproval::class);
    }

    // relasi ke tabel rfc_attachments (renamed to avoid collision with attachments JSON column)
    public function rfcAttachments()
    {
        return $this->hasMany(RfcAttachment::class);
    }

    // "low" -> "Low", "medium" -> "Medium", dll
    public function getPriorityLabelAttribute(): string
    {
        return ucfirst($this->priority ?? '');
    }
}
