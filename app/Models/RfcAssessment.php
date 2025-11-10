<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RfcAssessment extends Model
{
    // nama tabel sesuai migration
    protected $table = 'rfc_assessments';

    protected $fillable = [
        'rfc_id',
        'completeness_ok',
        'suggested_change_type',
        'risk_auto_score',
        'final_risk_score',
        'notes',
    ];

    public function rfc()
    {
        return $this->belongsTo(Rfc::class, 'rfc_id');
    }
}
