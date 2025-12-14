<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $rfc_id
 * @property string $level
 * @property int|null $approver_id
 * @property string|null $decision
 * @property string|null $reason
 * @property \Illuminate\Support\Carbon|null $approved_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class RfcApproval extends Model
{
    use HasFactory;

    protected $table = 'rfc_approvals';

    protected $fillable = [
        'rfc_id',
        'level',        // admin_opd, kasi, kabid, kadis, dll
        'approver_id',
        'decision',     // null (pending) | approve | reject | need_info | forward
        'reason',
        'approved_at',
        'updated_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    /*
     * Relasi ke RFC
     */
    public function rfc()
    {
        return $this->belongsTo(Rfc::class, 'rfc_id');
    }

    /*
     * Relasi ke user approver (kasi/kabid/kadis, dll)
     */
    public function approver()
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    /*
     * Helper: apakah approval ini masih pending?
     */
    public function isPending(): bool
    {
        return is_null($this->decision);
    }

    /*
     * Helper: apakah approval ini sudah diputuskan?
     */
    public function isDecided(): bool
    {
        return ! is_null($this->decision);
    }
}
