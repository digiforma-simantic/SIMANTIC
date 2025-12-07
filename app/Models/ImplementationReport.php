<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ImplementationReport extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'rfc_service_id',
        'rfc_id',
        'status',
        'description',
        'attachments',
        'completed_at',
    ];

    protected $casts = [
        'attachments' => 'array',
        'completed_at' => 'datetime',
    ];

    /**
     * Relasi ke RFC internal
     */
    public function rfc()
    {
        return $this->belongsTo(Rfc::class);
    }
}
