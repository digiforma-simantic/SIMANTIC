<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Rfc;

class RfcSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Rfc::create([
            'rfc_service_id' => 1,
            'ci_code'        => 'CI-2025-001',
            'title'          => 'Upgrade Server Database',
            'description'    => 'Melakukan upgrade pada server database utama untuk meningkatkan performa.',
            'priority'       => 'high',
            'status'         => 'pending',
            'config_comment' => 'Perlu koordinasi dengan tim DBA.',
            'attachments'    => [
                ['filename' => 'proposal.pdf', 'url' => '/storage/rfc/attachments/proposal.pdf'],
                ['filename' => 'timeline.xlsx', 'url' => '/storage/rfc/attachments/timeline.xlsx'],
            ],
            'requested_at'   => now(),
            'asset_uuid'     => '123e4567-e89b-12d3-a456-426614174000',
            'sso_id'         => 1001,
        ]);

        Rfc::create([
            'rfc_service_id' => 2,
            'ci_code'        => 'CI-2025-002',
            'title'          => 'Penambahan Storage Server',
            'description'    => 'Permintaan penambahan storage untuk server backup.',
            'priority'       => 'medium',
            'status'         => 'approved',
            'config_comment' => 'Sudah disetujui oleh manajer IT.',
            'attachments'    => [
                ['filename' => 'storage-request.pdf', 'url' => '/storage/rfc/attachments/storage-request.pdf'],
            ],
            'requested_at'   => now()->subDays(3),
            'asset_uuid'     => '223e4567-e89b-12d3-a456-426614174001',
            'sso_id'         => 1002,
        ]);

        // Tambah RFC status null
        Rfc::create([
            'rfc_service_id' => 3,
            'ci_code'        => 'CI-2025-003',
            'title'          => 'Install Aplikasi Kerja',
            'description'    => 'Permintaan instalasi aplikasi kerja baru.',
            'priority'       => 'high',
            'status'         => null, // status null
            'config_comment' => null,
            'attachments'    => null,
            'requested_at'   => now(),
            'asset_uuid'     => '323e4567-e89b-12d3-a456-426614174002',
            'sso_id'         => 6,
        ]);
    }
}
