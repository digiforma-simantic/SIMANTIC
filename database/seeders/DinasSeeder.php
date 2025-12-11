<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Dinas;

class DinasSeeder extends Seeder
{
    public function run(): void
    {
        $dinasList = [
            [
                'name' => 'Dinas Pendidikan Surabaya',
                'type' => 'dinas',
                'address' => '',
                'sso_dinas_id' => null,
            ],
            [
                'name' => 'Dinas Komunikasi dan Informatika Surabaya',
                'type' => 'diskominfo',
                'address' => '',
                'sso_dinas_id' => null,
            ],
        ];
        foreach ($dinasList as $dinas) {
            Dinas::updateOrCreate(['name' => $dinas['name']], $dinas);
        }
    }
}
