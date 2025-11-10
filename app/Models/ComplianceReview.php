<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ComplianceReview extends Model
{
    protected $table = 'compliance_reviews';

    protected $fillable = [
        'rfc_id',
        'reviewed_by',      // FK ke users.id (auditor)
        'review_date',
        'is_compliant',
        'notes',
    ];

    public function rfc()
    {
        return $this->belongsTo(Rfc::class, 'rfc_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
