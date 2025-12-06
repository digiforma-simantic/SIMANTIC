<?php

namespace App\Services;

use App\Models\Dinas;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DinasImportService
{
    /**
     * Import dinas dari SSO API
     * 
     * @return array Statistics hasil import
     */
    public function importFromSsoApi(): array
    {
        $url = 'https://api.bispro.digitaltech.my.id/api/v2/master/dinas';
        
        try {
            $response = Http::acceptJson()
                ->timeout(60)  // Increase timeout to 60 seconds
                ->retry(3, 1000)  // Retry 3 times with 1 second delay
                ->get($url);

            if (!$response->successful()) {
                throw new \Exception("Failed to fetch dinas from SSO API: " . $response->status());
            }

            $dinasData = $response->json('data', []);
            
            if (empty($dinasData)) {
                return [
                    'success' => true,
                    'imported' => 0,
                    'updated' => 0,
                    'errors' => [],
                    'total' => 0,
                    'message' => 'No dinas data from SSO API',
                ];
            }

            return $this->importBatch($dinasData);

        } catch (\Exception $e) {
            Log::error('DinasImportService error: ' . $e->getMessage());
            
            return [
                'success' => false,
                'imported' => 0,
                'updated' => 0,
                'errors' => [$e->getMessage()],
                'total' => 0,
                'message' => 'Failed to import dinas',
            ];
        }
    }

    /**
     * Import batch dinas
     */
    protected function importBatch(array $dinasData): array
    {
        $imported = 0;
        $updated = 0;
        $errors = [];

        foreach ($dinasData as $item) {
            try {
                $result = $this->importDinas($item);
                
                if ($result === 'created') {
                    $imported++;
                } elseif ($result === 'updated') {
                    $updated++;
                }
            } catch (\Exception $e) {
                $errors[] = "Dinas ID {$item['id']}: " . $e->getMessage();
                Log::warning("Failed to import dinas: " . $e->getMessage(), ['dinas' => $item]);
            }
        }

        return [
            'success' => true,
            'imported' => $imported,
            'updated' => $updated,
            'errors' => $errors,
            'total' => count($dinasData),
            'message' => "Import completed: {$imported} created, {$updated} updated",
        ];
    }

    /**
     * Import single dinas
     * 
     * @param array $item Data dinas dari SSO
     * @return string 'created' atau 'updated'
     */
    protected function importDinas(array $item): string
    {
        // Cari berdasarkan ID dari SSO
        $dinas = Dinas::where('sso_dinas_id', $item['id'])->first();

        $data = [
            'sso_dinas_id' => $item['id'],
            'name' => $item['name'],
            'address' => $item['address'] ?? null,
            'type' => $this->mapDinasType($item['name']),
        ];

        if ($dinas) {
            // Update existing
            $dinas->update($data);
            return 'updated';
        } else {
            // Create new
            Dinas::create($data);
            return 'created';
        }
    }

    /**
     * Map nama dinas ke tipe
     * 
     * @param string $name
     * @return string
     */
    protected function mapDinasType(string $name): string
    {
        $nameLower = strtolower($name);

        if (str_contains($nameLower, 'diskominfo') || str_contains($nameLower, 'komunikasi dan informatika')) {
            return 'diskominfo';
        }

        if (str_contains($nameLower, 'badan')) {
            return 'badan';
        }

        return 'dinas';
    }
}
