<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rfc extends Model
{
    protected $table = 'rfc';

    protected $fillable = [
        'title',
        'description',
        'category',
        'urgency',
        'priority',
        'status',
        'requester_id',
        'requester_opd_id',
    ];

    public function requester()
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function requesterOpd()
    {
        return $this->belongsTo(Opd::class, 'requester_opd_id');
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
}
