<?php

namespace Database\Seeders;

use App\Models\Opd;
use Illuminate\Database\Seeder;

class OpdSeeder extends Seeder
{
    public function run(): void
    {
        // JANGAN truncate, karena ada FK dari users
        // Opd::truncate();

        // Karena kamu pakai migrate:fresh --seed,
        // tabel opd PASTI kosong, jadi kita langsung insert saja.
        Opd::insert([
            [
                'name'       => 'Dinas Komunikasi dan Informatika',
                'type'       => 'diskominfo',
                'address'    => 'Jl. Raya No. 1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name'       => 'Dinas Kesehatan',
                'type'       => 'dinas',
                'address'    => 'Jl. Sehat No. 10',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name'       => 'Badan Perencanaan Daerah',
                'type'       => 'badan',
                'address'    => 'Jl. Pembangunan No. 5',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
