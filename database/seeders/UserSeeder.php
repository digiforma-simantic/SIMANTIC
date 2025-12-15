<?php

namespace Database\Seeders;

use App\Models\Dinas;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // jangan truncate, biar bisa aman dipanggil berkali-kali
        // User::truncate();

        // Tidak perlu insert dinas ke tabel dinas, hanya isi string di users

        $users = [
            [
                'name'          => 'Auditor Internal',
                'email'         => 'auditor1@example.com',
                'password'      => Hash::make('password'),
                'role'          => 'auditor',
                'dinas'         => 'Dinas Komunikasi dan Informatika Surabaya',
                'sso_id'        => null,
                'nip'           => '198905052010032006',
                'jenis_kelamin' => 'L',
            ],
            [
                'name'          => 'Kepala Bidang Infrastruktur',
                'email'         => 'kepala.bidang1@example.com',
                'password'      => Hash::make('password'),
                'role'          => 'kepala_bidang',
                'dinas'         => 'Dinas Komunikasi dan Informatika Surabaya',
                'sso_id'        => null,
                'nip'           => '198402102005021003',
                'jenis_kelamin' => 'L',
            ],
            [
                'name'          => 'Kepala Dinas Pendidikan',
                'email'         => 'kepala.dinas1@example.com',
                'password'      => Hash::make('password'),
                'role'          => 'kepala_dinas',
                'dinas'         => 'Dinas Komunikasi dan Informatika Surabaya',
                'sso_id'        => null,
                'nip'           => '197503152000031001',
                'jenis_kelamin' => 'L',
            ],
            [
                'name'          => 'Kepala Seksi Infrastruktur',
                'email'         => 'kepala.seksi1@example.com',
                'password'      => Hash::make('password'),
                'role'          => 'kepala_seksi',
                'dinas'         => 'Dinas Komunikasi dan Informatika Surabaya',
                'sso_id'        => null,
                'nip'           => '198601182010031004',
                'jenis_kelamin' => 'P',
            ],
            [
                'name'          => 'Staff Dinas Pendidikan',
                'email'         => 'staff1@example.com',
                'password'      => Hash::make('password'),
                'role'          => 'staff',
                'dinas'         => 'Dinas Komunikasi dan Informatika Surabaya',
                'sso_id'        => null,
                'nip'           => '199401102014032005',
                'jenis_kelamin' => 'P',
            ],
            [
                'name'          => 'Admin Dinas Pendidikan',
                'email'         => 'admin.dinas1@example.com',
                'password'      => Hash::make('password'),
                'role'          => 'admin_dinas',
                'dinas'         => 'Dinas Komunikasi dan Informatika Surabaya',
                'sso_id'        => null,
                'nip'           => '198001021999021002',
                'jenis_kelamin' => 'P',
            ],
            [
                'name'          => 'Admin Kota Surabaya',
                'email'         => 'admin.kota1@example.com',
                'password'      => Hash::make('password'),
                'role'          => 'admin_kota',
                'dinas'         => 'Dinas Komunikasi dan Informatika Surabaya',
                'sso_id'        => null,
                'nip'           => '197801011990011001',
                'jenis_kelamin' => 'L',
            ],
        ];

        foreach ($users as $data) {
            // Hanya isi kolom string dinas dan role, tidak pakai relasi id
            $data['dinas_id'] = null;
            $data['role_id'] = null;
            User::updateOrCreate(
                ['email' => $data['email']],
                $data
            );
        }
    }
}
