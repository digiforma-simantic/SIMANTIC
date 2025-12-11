<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Dinas;

class SyncDinasFromSso extends Command
{
    protected $signature = 'sync:dinas-sso';
    protected $description = 'Sinkronisasi data dinas dari SSO eksternal ke database lokal';

    public function handle()
    {
        $url = 'https://api.bispro.digitaltech.my.id/api/v2/master/dinas';
        $response = Http::acceptJson()->get($url);
        if ($response->ok()) {
            $dinasList = $response->json();
            $count = 0;
            foreach ($dinasList as $dinas) {
                Dinas::updateOrCreate(
                    ['id' => $dinas['id']],
                    [
                        'name' => $dinas['name'],
                        'address' => $dinas['address'],
                        'created_at' => $dinas['created_at'],
                        'updated_at' => $dinas['updated_at'],
                    ]
                );
                $count++;
            }
            $this->info("Sinkronisasi selesai. Total dinas diupdate: $count");
        } else {
            $this->error('Gagal mengambil data dari SSO');
        }
    }
}
