<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pir extends Model
{
    // migration kita pakai nama tabel 'pir'
    protected $table = 'pir';

    protected $fillable = [
        'rfc_id',
        'review_date',
        'result',           // successful / failed / partial
        'lessons_learned',
        'follow_up_actions',
    ];

    public function rfc()
    {
        return $this->belongsTo(Rfc::class, 'rfc_id');
    }
}
