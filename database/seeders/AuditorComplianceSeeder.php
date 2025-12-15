<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AuditorComplianceSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'auditor_id' => 8,
                'dinas' => 'Dinas Komunikasi dan Informatika Surabaya',
                'deskripsi' => 'Audit kepatuhan perangkat jaringan',
                'periode' => '2025-Q1',
                'attachment_audit' => null,
                'compliance' => 'compliant',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'auditor_id' => 8,
                'dinas' => 'Dinas Pendidikan Surabaya',
                'deskripsi' => 'Audit SOP backup data',
                'periode' => '2025-Q2',
                'attachment_audit' => null,
                'compliance' => 'non-compliant',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'auditor_id' => 8,
                'dinas' => 'Dinas Kesehatan Surabaya',
                'deskripsi' => 'Audit keamanan aplikasi',
                'periode' => '2025-Q3',
                'attachment_audit' => null,
                'compliance' => 'compliant',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'auditor_id' => 8,
                'dinas' => 'Dinas Perhubungan Surabaya',
                'deskripsi' => 'Audit akses user sistem',
                'periode' => '2025-Q4',
                'attachment_audit' => null,
                'compliance' => 'non-compliant',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('auditor_compliances')->insert($data);
    }
}
