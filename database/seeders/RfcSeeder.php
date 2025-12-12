<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class RfcSeeder extends Seeder
{
    public function run()
    {
        // Admin Dinas Kominfo (sso_id = 3)
        $adminDinasId = DB::table('users')->where('sso_id', 3)->value('id');
        $dinasId = DB::table('dinas')->where('name', 'Dinas Komunikasi dan Informatika')->value('id');

        // Dummy RFCs hanya untuk admin dinas Kominfo, tanpa approval
        $rfcs = [
            [
                'title' => 'Install Aplikasi Kerja',
                'description' => 'Permintaan instalasi aplikasi kerja baru untuk seluruh pegawai dinas.',
                'status' => 'draft',
                'created_by' => $adminDinasId,
                'dinas_id' => $dinasId,
                'created_at' => Carbon::parse('2025-08-17'),
                'updated_at' => Carbon::parse('2025-08-17'),
            ],
            [
                'title' => 'Update Server',
                'description' => 'Permintaan update server utama untuk peningkatan keamanan.',
                'status' => 'draft',
                'created_by' => $adminDinasId,
                'dinas_id' => $dinasId,
                'created_at' => Carbon::parse('2025-08-18'),
                'updated_at' => Carbon::parse('2025-08-18'),
            ],
        ];

        foreach ($rfcs as $rfc) {
            DB::table('rfc')->insert($rfc);
        }
    }
}
