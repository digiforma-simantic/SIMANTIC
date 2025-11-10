<?php

namespace Database\Seeders;

use App\Models\ConfigurationItem;
use App\Models\RiskRegister;
use Illuminate\Database\Seeder;

class RiskRegisterSeeder extends Seeder
{
    public function run(): void
    {

        $server   = ConfigurationItem::where('name', 'Server Aplikasi SIMANTIC')->first();
        $db       = ConfigurationItem::where('name', 'Database SIMANTIC')->first();
        $appDinkes = ConfigurationItem::where('name', 'Aplikasi Layanan Kesehatan')->first();

        $rows = [];

        if ($server) {
            $rows[] = [
                'ci_id'         => $server->id,
                'risk_category' => 'Security',
                'likelihood'    => 3,
                'impact'        => 4,
                'risk_score'    => 12,
                'treatment'     => 'Mitigate',
                'created_at'    => now(),
                'updated_at'    => now(),
            ];
        }

        if ($db) {
            $rows[] = [
                'ci_id'         => $db->id,
                'risk_category' => 'Data Loss',
                'likelihood'    => 2,
                'impact'        => 5,
                'risk_score'    => 10,
                'treatment'     => 'Backup & DR',
                'created_at'    => now(),
                'updated_at'    => now(),
            ];
        }

        if ($appDinkes) {
            $rows[] = [
                'ci_id'         => $appDinkes->id,
                'risk_category' => 'Availability',
                'likelihood'    => 4,
                'impact'        => 4,
                'risk_score'    => 16,
                'treatment'     => 'Increase capacity',
                'created_at'    => now(),
                'updated_at'    => now(),
            ];
        }

        if (! empty($rows)) {
            RiskRegister::insert($rows);
        }
    }
}
