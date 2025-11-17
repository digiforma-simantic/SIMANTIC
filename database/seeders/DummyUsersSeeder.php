<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DummyUsersSeeder extends Seeder
{
    public function run(): void
    {
        $userData = [
            [
                'name' => 'mas staff',
                'email' => 'staff@gmail.com',
                'role' => 'staff',
                'password' => bcrypt('31354')
            ],
            [
                'name' => 'mas admin',
                'email' => 'admin@gmail.com',
                'role' => 'admin',
                'password' => bcrypt('31354')
            ],
            [
                'name' => 'mas kasi',
                'email' => 'kasi@gmail.com',
                'role' => 'kepala_seksi',  // UBAH: tanpa spasi agar cocok dengan kode
                'password' => bcrypt('31354')
            ],
            [
                'name' => 'mas kabid',
                'email' => 'kabid@gmail.com',
                'role' => 'kepala_bidang',  // UBAH: tanpa spasi agar cocok dengan kode
                'password' => bcrypt('31354')
            ],
            [
                'name' => 'mas kadis',
                'email' => 'kadis@gmail.com',
                'role' => 'kepala_dinas',  // UBAH: tanpa spasi agar cocok dengan kode
                'password' => bcrypt('31354')
            ],
            [
                'name' => 'mas diskom',
                'email' => 'diskominfo@gmail.com',
                'role' => 'diskominfo',  // UBAH: tanpa spasi agar cocok dengan kode
                'password' => bcrypt('31354')
            ],
            [
                'name' => 'mas auuu',
                'email' => 'auditor@gmail.com',
                'role' => 'auditor',  // UBAH: tanpa spasi agar cocok dengan kode
                'password' => bcrypt('31354')
            ],
        ];

        foreach ($userData as $key => $val) {
            User::create($val);
        }
    }
}