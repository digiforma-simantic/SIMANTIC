<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RfcCi extends Model
{
    // nama tabel di migration: rfc_ci
    protected $table = 'rfc_ci';

    public $timestamps = false; // biasanya pivot tidak pakai timestamps

    protected $fillable = [
        'rfc_id',
        'ci_id',
        'role',     // optional: primary/secondary/impacted
    ];

    public function rfc()
    {
        return $this->belongsTo(Rfc::class, 'rfc_id');
    }

    public function configurationItem()
    {
        return $this->belongsTo(ConfigurationItem::class, 'ci_id');
    }
}
