<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'Admin Change', 'slug' => 'admin_change'],
            ['name' => 'Approver Kasi', 'slug' => 'approver_kasi'],
            ['name' => 'Approver Kabid', 'slug' => 'approver_kabid'],
            ['name' => 'Approver Kadis', 'slug' => 'approver_kadis'],
            ['name' => 'Technician', 'slug' => 'technician'],
            ['name' => 'User OPD', 'slug' => 'user_opd'],
            ['name' => 'Auditor Change', 'slug' => 'auditor_change'],
            // Backwards compatibility: common role slugs
            ['name' => 'Staff', 'slug' => 'staff'],
            ['name' => 'Admin OPD', 'slug' => 'admin_opd'],
            ['name' => 'Kepala Seksi', 'slug' => 'kepala_seksi'],
            ['name' => 'Kepala Bidang', 'slug' => 'kepala_bidang'],
            ['name' => 'Kepala Dinas', 'slug' => 'kepala_dinas'],
            ['name' => 'Diskominfo', 'slug' => 'diskominfo'],
        ];

        foreach ($roles as $r) {
            Role::updateOrCreate(['slug' => $r['slug']], $r);
        }
    }
}
