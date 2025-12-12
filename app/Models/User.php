<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Role;
use App\Models\Dinas;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $password
 * @property string|null $nip
 * @property string|null $jenis_kelamin
 * @property int|null $role_id
 * @property int|null $dinas_id
 * @property string|null $unit_kerja
 * @property int|null $unit_kerja_id
 * @property int|null $sso_id
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @property-read Role|null $roleObj
 * @property-read Dinas|null $dinas
 * @property-read Dinas|null $opd
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Kolom yang boleh diisi (sesuai migration)
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'nip',
        'jenis_kelamin',
        'role',
        'dinas',
        'unit_kerja_string',
        'sso_id',
    ];

    /**
     * Kolom yang disembunyikan saat JSON output
     */
    protected $hidden = [
        'password',
    ];

    /**
     * Casting tipe data
     */
    protected $casts = [];

    /* -------------------------------------------------------------------
     |  RELASI-RELASI DATA SIMANTIC
     |--------------------------------------------------------------------
     */

    // User → OPD (belongsTo)
    public function opd()
    {
        return $this->belongsTo(Dinas::class);
    }

    // User → Dinas (belongsTo via dinas_id)
    public function dinas()
    {
        return $this->belongsTo(Dinas::class, 'dinas_id');
    }

    // User → Role (belongsTo)
    public function roleObj()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    // Legacy: User as RFC requester (RFC now from Service Desk only)
    // Kept for backward compatibility - relationship no longer used
    public function requestedRfcs()
    {
        return $this->hasMany(Rfc::class, 'requester_id');
    }

    // User sebagai approver RFC
    public function approvals()
    {
        return $this->hasMany(RfcApproval::class, 'approver_id');
    }

    // User sebagai teknisi untuk Maintenance

  

    /* -------------------------------------------------------------------
     |  HELPER ROLE (BIAR MUDAH DIPAKAI DIMANA-MANA)
     |--------------------------------------------------------------------
     */

    protected function roleSlug(): ?string
    {
        return $this->roleObj?->slug ?? $this->role ?? null;
    }

    public function isStaff()
    {
        return $this->roleSlug() === 'staff';
    }

    public function isAdminKota()
    {
        return $this->roleSlug() === 'admin_kota';
    }

    public function isAdminDinas()
    {
        return $this->roleSlug() === 'admin_dinas';
    }

    public function isKepalaSeksi()
    {
        return $this->roleSlug() === 'kepala_seksi';
    }

    public function isKepalaBidang()
    {
        return $this->roleSlug() === 'kepala_bidang';
    }

    public function isKepalaDinas()
    {
        return $this->roleSlug() === 'kepala_dinas';
    }

    public function isAuditor()
    {
        return $this->roleSlug() === 'auditor';
    }

    public function isTeknisi()
    {
        return $this->roleSlug() === 'teknisi';
    }

    protected static function booted()
    {
        parent::booted();
        static::created(function ($user) {
            if ($user->dinas_id) {
                try {
                    $roleSlug = null;
                    if ($user->role_id) {
                        $role = Role::find($user->role_id);
                        $roleSlug = $role?->slug;
                    }
                    \DB::table('dinas_users')->insert([
                        'name'      => $user->name,
                        'role'      => $roleSlug,
                        'dinas_id'  => $user->dinas_id,
                        'sso_id'    => $user->sso_id,
                        'created_at'=> now(),
                        'updated_at'=> now(),
                    ]);
                } catch (\Throwable $e) {
                    // Log the error but don't block user creation
                    \Log::error('Failed to insert into dinas_users after user creation', [
                        'user_id' => $user->id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }
        });
    }
}
