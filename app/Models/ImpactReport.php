<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImpactReport extends Model
{
    protected $table = 'impact_reports';

    protected $fillable = [
        'rfc_id',
        'summary',
        'affected_services',
        'impact_level',
        'downtime_estimate',
        'risk_notes',
    ];

    public function rfc()
    {
        return $this->belongsTo(Rfc::class, 'rfc_id');
    }
}
