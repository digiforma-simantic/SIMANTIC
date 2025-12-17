<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Dinas;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Panggil seeder lainnya
        $this->call([
            DinasSeeder::class,
            // UserSeeder::class,
            RfcSeeder::class,
            RoleSeeder::class,
        ]);
    }
}
