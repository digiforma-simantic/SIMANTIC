<?php

namespace App\Services;

use App\Models\ConfigurationItem;
use App\Models\Dinas;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AssetImportService
{
    /**
     * Fetch assets from external API and import to Configuration Items
     *
     * @param string|null $token Bearer token for API authentication
     * @return array
     */
    public function importFromAssetApi(?string $token = null): array
    {
        $apiUrl = config('services.asset_api.url', 'https://api.siprima.digitaltech.my.id/api/assets');
        $apiToken = $token ?? config('services.asset_api.token');

        if (!$apiToken) {
            return [
                'success' => false,
                'message' => 'API token not configured',
            ];
        }

        try {
            // Fetch data dari API Aset
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Authorization' => 'Bearer ' . $apiToken,
                'X-CSRF-TOKEN' => $apiToken,
            ])->get($apiUrl);

            if (!$response->successful()) {
                Log::error('Asset API request failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return [
                    'success' => false,
                    'message' => 'Failed to fetch assets from API',
                    'status' => $response->status(),
                ];
            }

            $assets = $response->json('data', []);

            if (empty($assets)) {
                return [
                    'success' => false,
                    'message' => 'No assets found in API response',
                ];
            }

            $imported = 0;
            $updated = 0;
            $errors = [];

            foreach ($assets as $asset) {
                try {
                    $result = $this->importAsset($asset);
                    if ($result['created']) {
                        $imported++;
                    } else {
                        $updated++;
                    }
                } catch (\Exception $e) {
                    $errors[] = [
                        'asset_id' => $asset['id'] ?? 'unknown',
                        'error' => $e->getMessage(),
                    ];
                    Log::error('Failed to import asset', [
                        'asset' => $asset,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            return [
                'success' => true,
                'message' => 'Assets imported successfully',
                'imported' => $imported,
                'updated' => $updated,
                'errors' => $errors,
                'total' => count($assets),
            ];

        } catch (\Exception $e) {
            Log::error('Asset import failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'message' => 'Asset import failed: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Import single asset to Configuration Item
     *
     * @param array $asset
     * @return array
     */
    protected function importAsset(array $asset): array
    {
        // Cari atau buat Configuration Item berdasarkan asset_id
        $ci = ConfigurationItem::firstOrNew([
            'asset_id' => $asset['id'],
        ]);

        $isNew = !$ci->exists;

        // Generate CI Code jika belum ada
        if (empty($ci->ci_code)) {
            $ci->ci_code = $this->generateCiCode();
        }

        // Map data dari API Aset
        $ci->name = $asset['nama'] ?? $asset['name'] ?? 'Unknown Asset';
        $ci->subkategori = $asset['subkategori_id'] ?? null;
        $ci->lokasi = $asset['lokasi_id'] ?? null;
        $ci->penanggung_jawab = $asset['tgl_perolahan'] ?? null; // Sesuaikan dengan field yang tepat
        $ci->is_usage = $asset['is_usage'] ?? null;

        // Set default values untuk required fields jika belum ada
        if (empty($ci->type)) {
            $ci->type = $this->mapAssetTypeToCI($asset);
        }

        if (empty($ci->environment)) {
            $ci->environment = 'production';
        }

        if (empty($ci->criticality)) {
            $ci->criticality = 'medium';
        }

        if (empty($ci->status)) {
            $ci->status = $asset['kondisi'] === 'baik' ? 'active' : 'maintenance';
        }

        // Get atau buat default OPD jika tidak ada
        if (empty($ci->owner_dinas_id)) {
            $defaultDinas = Dinas::first();
            if ($defaultDinas) {
                $ci->owner_dinas_id = $defaultDinas->id;
            }
        }

        // Informasi konfigurasi tambahan (akan diisi manual atau dari sumber lain)
        // version, os_name, ip_address, relation_note tetap null sampai diisi manual

        $ci->save();

        return [
            'created' => $isNew,
            'ci' => $ci,
        ];
    }

    /**
     * Generate unique CI Code
     *
     * @return string
     */
    protected function generateCiCode(): string
    {
        $prefix = 'CI';
        $lastCi = ConfigurationItem::whereNotNull('ci_code')
            ->orderBy('ci_code', 'desc')
            ->first();

        if ($lastCi && preg_match('/CI-(\d+)/', $lastCi->ci_code, $matches)) {
            $number = intval($matches[1]) + 1;
        } else {
            $number = 1;
        }

        return sprintf('%s-%06d', $prefix, $number);
    }

    /**
     * Map asset type to CI type
     *
     * @param array $asset
     * @return string
     */
    protected function mapAssetTypeToCI(array $asset): string
    {
        // Mapping dari kategori aset ke CI type
        $kategori = $asset['kategori'] ?? null;
        
        $mapping = [
            'Komputer' => 'server',
            'Laptop' => 'workstation',
            'Server' => 'server',
            'Network' => 'network',
            'Printer' => 'peripheral',
        ];

        return $mapping[$kategori] ?? 'other';
    }
}
