<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // <-- betulkan ini: properti $casts, bukan function
    protected $casts = [
        'email_verified_at' => 'datetime',
        // 'password' => 'hashed', // opsional: jika Laravel versi mendukung cast 'hashed'
    ];
}
