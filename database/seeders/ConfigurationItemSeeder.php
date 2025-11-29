<?php

namespace Database\Seeders;

use App\Models\ConfigurationItem;
use App\Models\Dinas;
use Illuminate\Database\Seeder;

class ConfigurationItemSeeder extends Seeder
{
    public function run(): void
    {

        $diskominfo = Dinas::where('type', 'diskominfo')->first();
        $dinkes     = Dinas::where('name', 'Dinas Kesehatan')->first();

        ConfigurationItem::insert([
            [
                'name'         => 'Server Aplikasi SIMANTIC',
                'type'         => 'server',
                'owner_opd_id' => $diskominfo?->id,
                'environment'  => 'production',
                'criticality'  => 'high',
                'status'       => 'active',
                'version'      => '1.0.0',
                'patch_level'  => 'PL-2025-01',
                'risk_level'   => 0,
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
            [
                'name'         => 'Database SIMANTIC',
                'type'         => 'database',
                'owner_opd_id' => $diskominfo?->id,
                'environment'  => 'production',
                'criticality'  => 'critical',
                'status'       => 'active',
                'version'      => '12c',
                'patch_level'  => 'PL-2025-01',
                'risk_level'   => 0,
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
            [
                'name'         => 'Aplikasi Layanan Kesehatan',
                'type'         => 'application',
                'owner_opd_id' => $dinkes?->id,
                'environment'  => 'production',
                'criticality'  => 'high',
                'status'       => 'active',
                'version'      => '3.2.1',
                'patch_level'  => 'PL-2025-02',
                'risk_level'   => 0,
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
        ]);
    }
}
