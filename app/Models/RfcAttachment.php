<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RfcAttachment extends Model
{
    use HasFactory;

    protected $table = 'rfc_attachments';

    protected $fillable = [
        'rfc_id',
        'url',
        'file_name',
        'mime_type',
    ];

    public function rfc()
    {
        return $this->belongsTo(Rfc::class, 'rfc_id');
    }
}
