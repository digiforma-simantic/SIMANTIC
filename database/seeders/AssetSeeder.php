<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AssetSeeder extends Seeder
{
    public function run()
    {
        DB::table('assets')->truncate(); // Kosongkan tabel sebelum seeding ulang
        DB::table('assets')->insert([
            [
                'aset_uuid'        => 'M-25-001',
                'nama'             => 'Laptop M-25-001',
                'lokasi'           => 'Gedung A, Lantai 5, Area Karyawan',
                'penanggung_jawab' => 'Suhandoyo',
                'level_resiko'     => 'Low',
                'sub_kategori'     => 'Hardware',
                'created_at'       => Carbon::parse('2025-08-17 10:00:00'),
                'updated_at'       => Carbon::now(),
            ],
            [
                'aset_uuid'        => 'TI.001.2025.00001',
                'nama'             => 'Laptop Dell Latitude 5420',
                'lokasi'           => 'Kantor Pusat',
                'penanggung_jawab' => 'Budi Santoso',
                'level_resiko'     => 'Low',
                'sub_kategori'     => 'Laptop',
                'created_at'       => Carbon::parse('2025-06-11 07:57:30'),
                'updated_at'       => Carbon::now(),
            ],
            [
                'aset_uuid'        => 'TI.001.2025.00002',
                'nama'             => 'Printer Epson L3150',
                'lokasi'           => 'Gedung A, Lantai 5',
                'penanggung_jawab' => 'Siti Aminah',
                'level_resiko'     => 'Medium',
                'sub_kategori'     => 'Printer',
                'created_at'       => Carbon::parse('2025-07-01 09:00:00'),
                'updated_at'       => Carbon::now(),
            ],
        ]);
    }
}
