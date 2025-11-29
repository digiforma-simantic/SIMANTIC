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

        $diskominfo = Dinas::where('type', 'diskominfo')->first();
        $dinkes     = Dinas::where('name', 'Dinas Kesehatan')->first();

        $users = [
            // Admin Change (Diskominfo)
            [
                'name'              => 'Admin Change',
                'email'             => 'admin.change@example.com',
                'password'          => Hash::make('password123'),
                'role_id'           => Role::where('slug', 'admin_change')->first()?->id,
                'sso_id'            => 'sso-1',
                'dinas_id'          => $diskominfo?->id,
                'nip'               => null,
                'jenis_kelamin'     => null,
            ],
            // Approver Kasi
            [
                'name'              => 'Kasi Infrastruktur',
                'email'             => 'kasi.infra@example.com',
                'password'          => Hash::make('password123'),
                'role_id'           => Role::where('slug', 'approver_kasi')->first()?->id,
                'sso_id'            => 'sso-2',
                'dinas_id'          => $diskominfo?->id,
                'nip'               => null,
                'jenis_kelamin'     => null,
            ],
            // Approver Kabid
            [
                'name'              => 'Kabid TIK',
                'email'             => 'kabid.tik@example.com',
                'password'          => Hash::make('password123'),
                'role_id'           => Role::where('slug', 'approver_kabid')->first()?->id,
                'sso_id'            => 'sso-3',
                'dinas_id'          => $diskominfo?->id,
                'nip'               => null,
                'jenis_kelamin'     => null,
            ],
            // Approver Kadis
            [
                'name'              => 'Kadis Kominfo',
                'email'             => 'kadis.kominfo@example.com',
                'password'          => Hash::make('password123'),
                'role_id'           => Role::where('slug', 'approver_kadis')->first()?->id,
                'sso_id'            => 'sso-4',
                'dinas_id'          => $diskominfo?->id,
                'nip'               => null,
                'jenis_kelamin'     => null,
            ],
            // Teknisi
            [
                'name'              => 'Teknisi Infrastruktur',
                'email'             => 'teknisi@example.com',
                'password'          => Hash::make('password123'),
                'role_id'           => Role::where('slug', 'technician')->first()?->id,
                'sso_id'            => 'sso-5',
                'dinas_id'          => $diskominfo?->id,
                'nip'               => null,
                'jenis_kelamin'     => null,
            ],
            // User OPD lain (pemohon RFC)
            [
                'name'              => 'Operator Dinas Kesehatan',
                'email'             => 'opd.dinkes@example.com',
                'password'          => Hash::make('password123'),
                'role_id'           => Role::where('slug', 'user_opd')->first()?->id,
                'sso_id'            => 'sso-6',
                'dinas_id'          => $dinkes?->id,
                'nip'               => null,
                'jenis_kelamin'     => null,
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
