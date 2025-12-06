<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int|null $sso_dinas_id
 * @property string $name
 * @property string|null $type
 * @property string|null $address
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class Dinas extends Model
{
    protected $table = 'dinas';

    protected $fillable = [
        'sso_dinas_id',
        'name',
        'type',
        'address',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function configurationItems()
    {
        return $this->hasMany(ConfigurationItem::class, 'owner_dinas_id');
    }

    // Legacy: RFCs requested by this OPD (RFC now from Service Desk only)
    // Kept for backward compatibility - relationship no longer used
    public function rfcsAsRequester()
    {
        return $this->hasMany(Rfc::class, 'requester_opd_id');
    }
}
