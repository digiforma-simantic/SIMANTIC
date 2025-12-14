<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditorCompliance extends Model
{
    use HasFactory;

    protected $fillable = [
        'auditor_id',
        'dinas',
        'deskripsi',
        'periode',
        'attachment_audit',
        'compliance',
    ];

    // Relasi ke User (Auditor)
    public function auditor()
    {
        return $this->belongsTo(User::class, 'auditor_id');
    }
}
