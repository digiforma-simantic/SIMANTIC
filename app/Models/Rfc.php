<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rfc extends Model
{
    protected $table = 'rfc';

    protected $fillable = [
        'ticket_code',
        'title',
        'description',
        'category',
        'urgency',
        'priority',          // low | medium | high
        'status',
        'requester_id',
        'requester_opd_id',
        'tech_note',
        'request_at',
        'asset_id',
    ];

    public function requester()
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function requesterOpd()
    {
        return $this->belongsTo(Dinas::class, 'requester_opd_id');
    }

    public function configurationItems()
    {
        return $this->belongsToMany(ConfigurationItem::class, 'rfc_ci', 'rfc_id', 'ci_id');
    }

    public function assessment()
    {
        return $this->hasOne(RfcAssessment::class);
    }

    public function approvals()
    {
        return $this->hasMany(RfcApproval::class);
    }

    // approval yang lagi menunggu (status pending)
    public function currentApproval()
    {
        return $this->hasOne(RfcApproval::class)
                    ->where('status', 'pending')
                    ->latest(); // ambil pending terakhir kalau lebih dari 1
    }

    public function impactReport()
    {
        return $this->hasOne(ImpactReport::class);
    }

    public function changePlan()
    {
        return $this->hasOne(ChangePlan::class);
    }

    public function execution()
    {
        return $this->hasOne(ChangeExecution::class);
    }

    public function pir()
    {
        return $this->hasOne(Pir::class);
    }

    public function complianceReview()
    {
        return $this->hasOne(ComplianceReview::class);
    }

    public function maintenanceLogs()
    {
        return $this->hasMany(MaintenanceLog::class, 'ref_rfc_id');
    }

    public function patchDeployments()
    {
        return $this->hasMany(PatchDeployment::class, 'ref_rfc_id');
    }

    // relasi ke tabel rfc_attachments
    public function attachments()
    {
        return $this->hasMany(RfcAttachment::class);
    }

    // "low" -> "Low", "medium" -> "Medium", dll
    public function getPriorityLabelAttribute(): string
    {
        return ucfirst($this->priority ?? '');
    }
}
