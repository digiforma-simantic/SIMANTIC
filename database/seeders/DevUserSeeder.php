<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class DevUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get roles
        $roles = [
            'admin_kota' => Role::where('slug', 'admin_kota')->first(),
            'admin_dinas' => Role::where('slug', 'admin_dinas')->first(),
            'kepala_dinas' => Role::where('slug', 'kepala_dinas')->first(),
            'kepala_seksi' => Role::where('slug', 'kepala_seksi')->first(),
            'kepala_bidang' => Role::where('slug', 'kepala_bidang')->first(),
            'staff' => Role::where('slug', 'staff')->first(),
            'auditor' => Role::where('slug', 'auditor')->first(),
        ];

        // Get first dinas for reference
        $firstDinas = \App\Models\Dinas::first();
        $dinasId = $firstDinas ? $firstDinas->id : null;

        // Create dev users with complete data
        $users = [
            [
                'name' => 'Admin Kota Manado',
                'email' => 'admin.kota@example.com',
                'nip' => '198501012010011001',
                'jenis_kelamin' => 'L',
                'role' => 'admin_kota',
                'dinas_id' => $dinasId,
                'unit_kerja' => 'Diskominfo Kota Manado',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Budi Santoso, S.Kom',
                'email' => 'admin.dinas@example.com',
                'nip' => '198502012010011002',
                'jenis_kelamin' => 'L',
                'role' => 'admin_dinas',
                'dinas_id' => $dinasId,
                'unit_kerja' => 'Sekretariat Dinas Kominfo',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Dr. Siti Rahma, M.Si',
                'email' => 'kepala.dinas@example.com',
                'nip' => '198503012010011003',
                'jenis_kelamin' => 'P',
                'role' => 'kepala_dinas',
                'dinas_id' => $dinasId,
                'unit_kerja' => 'Dinas Komunikasi dan Informatika',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Ahmad Fauzi, S.T., M.T',
                'email' => 'kepala.seksi@example.com',
                'nip' => '198504012010011004',
                'jenis_kelamin' => 'L',
                'role' => 'kepala_seksi',
                'dinas_id' => $dinasId,
                'unit_kerja' => 'Seksi Infrastruktur TIK',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Ir. Riko Pratama',
                'email' => 'kepala.bidang@example.com',
                'nip' => '198507252010011007',
                'jenis_kelamin' => 'L',
                'role' => 'kepala_bidang',
                'dinas_id' => $dinasId,
                'unit_kerja' => 'Bidang Infrastruktur dan Operasional',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Dewi Lestari, S.Kom',
                'email' => 'staff@example.com',
                'nip' => '198505012010011005',
                'jenis_kelamin' => 'P',
                'role' => 'staff',
                'dinas_id' => $dinasId,
                'unit_kerja' => 'Sub Bagian Umum',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Andi Wijaya, S.E., Ak',
                'email' => 'auditor@example.com',
                'nip' => '198506012010011006',
                'jenis_kelamin' => 'L',
                'role' => 'auditor',
                'dinas_id' => $dinasId,
                'unit_kerja' => 'Inspektorat Kota',
                'password' => Hash::make('password'),
            ],
        ];

        foreach ($users as $userData) {
            $roleSlug = $userData['role'];
            unset($userData['role']);

            // Add role_id if role exists
            if (isset($roles[$roleSlug]) && $roles[$roleSlug]) {
                $userData['role_id'] = $roles[$roleSlug]->id;
            }

            // Create or update user
            $user = User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );

            $this->command->info("Created/Updated user: {$user->email} (role: {$roleSlug})");
        }
    }
}
