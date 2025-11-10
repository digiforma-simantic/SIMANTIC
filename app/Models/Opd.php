<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Opd extends Model
{
    protected $table = 'opd';

    protected $fillable = [
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
        return $this->hasMany(ConfigurationItem::class, 'owner_opd_id');
    }

    public function rfcsAsRequester()
    {
        return $this->hasMany(Rfc::class, 'requester_opd_id');
    }
}
