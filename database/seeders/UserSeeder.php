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

        $diskominfo = Dinas::firstOrCreate(
            ['name' => 'Dinas Komunikasi dan Informatika Surabaya'],
            ['type' => 'diskominfo', 'address' => 'Jl. Protokol No. 1, Surabaya']
        );

        $dinasPendidikan = Dinas::firstOrCreate(
            ['name' => 'Dinas Pendidikan Surabaya'],
            ['type' => 'dinas', 'address' => 'Jl. Pendidikan No. 5, Surabaya']
        );

        $users = [
            [
                'name'          => 'Auditor Internal',
                'email'         => 'auditor@example.com',
                'password'      => Hash::make('password'),
                'role_id'       => Role::where('slug', 'auditor')->first()?->id,
                'sso_id'        => null,
                'dinas_id'      => $dinasPendidikan?->id,
                'nip'           => '198905052010032006',
                'jenis_kelamin' => 'L',
            ],
            [
                'name'          => 'Kepala Bidang Infrastruktur',
                'email'         => 'kepala.bidang@example.com',
                'password'      => Hash::make('password'),
                'role_id'       => Role::where('slug', 'kepala_bidang')->first()?->id,
                'sso_id'        => null,
                'dinas_id'      => $dinasPendidikan?->id,
                'nip'           => '198402102005021003',
                'jenis_kelamin' => 'L',
            ],
            [
                'name'          => 'Kepala Dinas Pendidikan',
                'email'         => 'kepala.dinas@example.com',
                'password'      => Hash::make('password'),
                'role_id'       => Role::where('slug', 'kepala_dinas')->first()?->id,
                'sso_id'        => null,
                'dinas_id'      => $dinasPendidikan?->id,
                'nip'           => '197503152000031001',
                'jenis_kelamin' => 'L',
            ],
            [
                'name'          => 'Kepala Seksi Infrastruktur',
                'email'         => 'kepala.seksi@example.com',
                'password'      => Hash::make('password'),
                'role_id'       => Role::where('slug', 'kepala_seksi')->first()?->id,
                'sso_id'        => null,
                'dinas_id'      => $dinasPendidikan?->id,
                'nip'           => '198601182010031004',
                'jenis_kelamin' => 'P',
            ],
            [
                'name'          => 'Staff Dinas Pendidikan',
                'email'         => 'staff@example.com',
                'password'      => Hash::make('password'),
                'role_id'       => Role::where('slug', 'staff')->first()?->id,
                'sso_id'        => null,
                'dinas_id'      => $dinasPendidikan?->id,
                'nip'           => '199401102014032005',
                'jenis_kelamin' => 'P',
            ],
            [
                'name'          => 'Admin Dinas Pendidikan',
                'email'         => 'admin.dinas@example.com',
                'password'      => Hash::make('password'),
                'role_id'       => Role::where('slug', 'admin_dinas')->first()?->id,
                'sso_id'        => null,
                'dinas_id'      => $dinasPendidikan?->id,
                'nip'           => '198001021999021002',
                'jenis_kelamin' => 'P',
            ],
            [
                'name'          => 'Admin Kota Surabaya',
                'email'         => 'admin.kota@example.com',
                'password'      => Hash::make('password'),
                'role_id'       => Role::where('slug', 'admin_kota')->first()?->id,
                'sso_id'        => null,
                'dinas_id'      => $diskominfo?->id,
                'nip'           => '197801011990011001',
                'jenis_kelamin' => 'L',
            ],
        ];

        foreach ($users as $data) {
            User::updateOrCreate(
                ['email' => $data['email']], // kunci unik
                $data                          // data yang di-update / diisi
            );
        }
    }
}
