<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'Staff', 'slug' => 'staff'],
            ['name' => 'Admin Dinas', 'slug' => 'admin_dinas'],
            ['name' => 'Admin Kota', 'slug' => 'admin_kota'],
            ['name' => 'Kepala Dinas', 'slug' => 'kepala_dinas'],
            ['name' => 'Kepala Bidang', 'slug' => 'kepala_bidang'],
            ['name' => 'Kepala Seksi', 'slug' => 'kepala_seksi'],
            ['name' => 'Auditor', 'slug' => 'auditor'],
        ];

        $allowedSlugs = collect($roles)->pluck('slug')->all();

        Role::whereNotIn('slug', $allowedSlugs)->delete();

        foreach ($roles as $r) {
            Role::updateOrCreate(['slug' => $r['slug']], $r);
        }
    }
}
