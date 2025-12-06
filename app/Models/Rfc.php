<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int|null $rfc_service_id
 * @property string|null $ci_code
 * @property string $title
 * @property string|null $description
 * @property string $priority
 * @property string $status
 * @property string|null $config_comment
 * @property array|null $attachments
 * @property \Illuminate\Support\Carbon|null $requested_at
 * @property string|null $asset_uuid
 * @property int|null $sso_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @property-read string $priority_label
 */
class Rfc extends Model
{
    protected $table = 'rfc';

    protected $fillable = [
        'rfc_service_id',
        'ci_code',
        'title',
        'description',
        'priority',          // low | medium | high
        'status',            // pending | approved | rejected
        'config_comment',
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

    /**
     * Get formatted priority label
     * @return string
     */
    public function getPriorityLabelAttribute(): string
    {
        return ucfirst($this->priority ?? '');
    }

    // Helper: check if RFC can send callback to Service Desk
    public function canSendCallback(): bool
    {
        return !empty($this->rfc_service_id);
    }
}
