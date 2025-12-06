<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string $message
 * @property string|null $ref_type
 * @property int|null $ref_id
 * @property bool $is_read
 * @property \Illuminate\Support\Carbon|null $read_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'message',
        'ref_type',
        'ref_id',
        'is_read',
        'read_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
