<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            OpdSeeder::class,
            RoleSeeder::class,
            UserSeeder::class,
            ConfigurationItemSeeder::class,
            RiskRegisterSeeder::class,
        ]);
    }
}
