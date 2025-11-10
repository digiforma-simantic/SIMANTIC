<?php

namespace Database\Seeders;

use App\Models\Opd;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // jangan truncate, biar bisa aman dipanggil berkali-kali
        // User::truncate();

        $diskominfo = Opd::where('type', 'diskominfo')->first();
        $dinkes     = Opd::where('name', 'Dinas Kesehatan')->first();

        $users = [
            // Admin Change (Diskominfo)
            [
                'name'              => 'Admin Change',
                'email'             => 'admin.change@example.com',
                'password'          => Hash::make('password123'),
                'role'              => 'admin_change',
                'opd_id'            => $diskominfo?->id,
                'email_verified_at' => now(),
            ],
            // Approver Kasi
            [
                'name'              => 'Kasi Infrastruktur',
                'email'             => 'kasi.infra@example.com',
                'password'          => Hash::make('password123'),
                'role'              => 'approver_kasi',
                'opd_id'            => $diskominfo?->id,
                'email_verified_at' => now(),
            ],
            // Approver Kabid
            [
                'name'              => 'Kabid TIK',
                'email'             => 'kabid.tik@example.com',
                'password'          => Hash::make('password123'),
                'role'              => 'approver_kabid',
                'opd_id'            => $diskominfo?->id,
                'email_verified_at' => now(),
            ],
            // Approver Kadis
            [
                'name'              => 'Kadis Kominfo',
                'email'             => 'kadis.kominfo@example.com',
                'password'          => Hash::make('password123'),
                'role'              => 'approver_kadis',
                'opd_id'            => $diskominfo?->id,
                'email_verified_at' => now(),
            ],
            // Teknisi
            [
                'name'              => 'Teknisi Infrastruktur',
                'email'             => 'teknisi@example.com',
                'password'          => Hash::make('password123'),
                'role'              => 'technician',
                'opd_id'            => $diskominfo?->id,
                'email_verified_at' => now(),
            ],
            // User OPD lain (pemohon RFC)
            [
                'name'              => 'Operator Dinas Kesehatan',
                'email'             => 'opd.dinkes@example.com',
                'password'          => Hash::make('password123'),
                'role'              => 'user_opd',
                'opd_id'            => $dinkes?->id,
                'email_verified_at' => now(),
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
