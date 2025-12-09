<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'Admin Kota', 'slug' => 'admin_kota'],
            ['name' => 'Admin Dinas', 'slug' => 'admin_dinas'],
            ['name' => 'Kepala Dinas', 'slug' => 'kepala_dinas'],
            ['name' => 'Kepala Bidang', 'slug' => 'kepala_bidang'],
            ['name' => 'Kepala Seksi', 'slug' => 'kepala_seksi'],
            ['name' => 'Staff', 'slug' => 'staff'],
            ['name' => 'Auditor', 'slug' => 'auditor'],
            ['name' => 'Teknisi', 'slug' => 'teknisi'],
        ];

        $allowedSlugs = collect($roles)->pluck('slug')->all();

        Role::whereNotIn('slug', $allowedSlugs)->delete();

        foreach ($roles as $r) {
            Role::updateOrCreate(['slug' => $r['slug']], $r);
        }
    }
}
