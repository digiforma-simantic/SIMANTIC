<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiskRegister extends Model
{
    // ✅ supaya Eloquent pakai tabel 'risk_register', bukan 'risk_registers'
    protected $table = 'risk_register';

    protected $fillable = [
        'ci_id',
        'risk_category',
        'likelihood',
        'impact',
        'risk_score',
        'treatment',
    ];

    public function configurationItem()
    {
        return $this->belongsTo(ConfigurationItem::class, 'ci_id');
    }
}
