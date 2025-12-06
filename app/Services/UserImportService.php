<?php

namespace App\Services;

use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class UserImportService
{
    /**
     * Import users dari SSO API
     * 
     * @param string|null $token Bearer token untuk SSO API
     * @return array Statistics hasil import
     */
    public function importFromSsoApi(?string $token = null): array
    {
        $url = 'https://api.bispro.digitaltech.my.id/api/v2/auth/users';
        $bearerToken = $token ?? env('SSO_API_TOKEN');
        
        if (!$bearerToken) {
            return [
                'success' => false,
                'imported' => 0,
                'updated' => 0,
                'errors' => ['SSO API token is required'],
                'total' => 0,
                'message' => 'No SSO API token provided',
            ];
        }

        try {
            $response = Http::acceptJson()
                ->withToken($bearerToken)
                ->timeout(60)  // Increase timeout to 60 seconds
                ->retry(3, 1000)  // Retry 3 times with 1 second delay
                ->get($url);

            if (!$response->successful()) {
                throw new \Exception("Failed to fetch users from SSO API: " . $response->status());
            }

            $usersData = $response->json('data', []);
            
            if (empty($usersData)) {
                return [
                    'success' => true,
                    'imported' => 0,
                    'updated' => 0,
                    'errors' => [],
                    'total' => 0,
                    'message' => 'No users data from SSO API',
                ];
            }

            return $this->importBatch($usersData);

        } catch (\Exception $e) {
            Log::error('UserImportService error: ' . $e->getMessage());
            
            return [
                'success' => false,
                'imported' => 0,
                'updated' => 0,
                'errors' => [$e->getMessage()],
                'total' => 0,
                'message' => 'Failed to import users',
            ];
        }
    }

    /**
     * Import batch users
     */
    protected function importBatch(array $usersData): array
    {
        $imported = 0;
        $updated = 0;
        $errors = [];

        foreach ($usersData as $item) {
            try {
                $result = $this->importUser($item);
                
                if ($result === 'created') {
                    $imported++;
                } elseif ($result === 'updated') {
                    $updated++;
                }
            } catch (\Exception $e) {
                $errors[] = "User ID {$item['id']}: " . $e->getMessage();
                Log::warning("Failed to import user: " . $e->getMessage(), ['user' => $item]);
            }
        }

        return [
            'success' => true,
            'imported' => $imported,
            'updated' => $updated,
            'errors' => $errors,
            'total' => count($usersData),
            'message' => "Import completed: {$imported} created, {$updated} updated",
        ];
    }

    /**
     * Import single user
     * 
     * @param array $item Data user dari SSO
     * @return string 'created' atau 'updated'
     */
    protected function importUser(array $item): string
    {
        // Cari user berdasarkan email atau sso_id
        $user = User::where('email', $item['email'])
                    ->orWhere('sso_id', $item['id'])
                    ->first();

        $data = [
            'sso_id' => $item['id'],
            'name' => $item['name'],
            'email' => $item['email'],
            'nip' => $item['nip'] ?? null,
            'jenis_kelamin' => $item['jenis_kelamin'] ?? null,
            'unit_kerja' => $item['unit_kerja'] ?? null,
            'email_verified_at' => $item['email_verified_at'] ?? now(),
        ];

        // Map role dari SSO ke role_id
        if (!empty($item['role'])) {
            $role = Role::where('slug', $item['role'])->first();
            if ($role) {
                $data['role_id'] = $role->id;
            }
        }

        // Map dinas jika ada
        if (!empty($item['dinas'])) {
            // Assume dinas is either ID or name
            if (is_numeric($item['dinas'])) {
                $data['dinas_id'] = $item['dinas'];
            }
        }

        // Set default password jika user baru (dari SSO, password tidak dipakai)
        if (!$user) {
            $data['password'] = Hash::make('password'); // Default password
        }

        if ($user) {
            // Update existing
            $user->update($data);
            return 'updated';
        } else {
            // Create new
            User::create($data);
            return 'created';
        }
    }
}
