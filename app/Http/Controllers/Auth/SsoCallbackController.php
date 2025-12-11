<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\Role;
use App\Models\Dinas;

class SsoCallbackController extends Controller
{
    /**
     * Handle SSO callback from central authentication system
     * 
     * Flow:
     * 1. User logs in at SSO portal (https://api.bispro.digitaltech.my.id)
     * 2. SSO redirects to: https://simantic.online/api/sso/callback?token=xxx
     * 3. We verify token with SSO API /api/v2/auth/me
     * 4. Create/update user in local database
     * 5. Generate local Sanctum token
     * 6. Redirect to frontend with token
     */
    public function callback(Request $request)
    {
        $ssoToken = $request->query('token');

        if (!$ssoToken) {
            return response()->json([
                'success' => false,
                'message' => 'Token SSO tidak ditemukan',
            ], 400);
        }

        try {
            // Verify token with SSO API
            $response = Http::timeout(30)
                ->withHeaders([
                    'Authorization' => "Bearer {$ssoToken}",
                    'Accept' => 'application/json',
                ])
                ->get('https://api.bispro.digitaltech.my.id/api/v2/auth/me');

            if (!$response->successful()) {
                Log::error('SSO token verification failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Token SSO tidak valid atau sudah kadaluarsa',
                ], 401);
            }

            $ssoData = $response->json();

            if (!isset($ssoData['success']) || !$ssoData['success']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal memverifikasi token SSO',
                ], 401);
            }

            $userData = $ssoData['data'] ?? null;

            if (!$userData || !isset($userData['email'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data user tidak lengkap dari SSO',
                ], 400);
            }

            // Sync user to local database
            $user = $this->syncUserFromSso($userData);


            // Generate local Sanctum token
            $token = $user->createToken('sso-login')->plainTextToken;

            // Mapping role ke dashboard path
            $roleToDashboard = [
                'admin_kota'     => '/diskominfo/dashboarddiskominfo',
                'admin_dinas'    => '/Admin/dashboardadmin',
                'auditor'        => '/auditor/dashboardauditor',
                'kepala_seksi'   => '/Kasi/dashboardkasi',
                'staff'          => '/staff/dashboardstaff',
                'kepala_dinas'   => '/Kadis/dashboardkadis',
                'kepala_bidang'  => '/Kabid/dashboardkabid',
                // tambahkan sesuai kebutuhan
            ];
            $role = $user->roleObj?->slug ?? 'staff';
            $dashboardPath = $roleToDashboard[$role] ?? '/dashboard';

            // Redirect ke frontend sesuai role
            $frontendUrl = config('app.frontend_url', 'http://localhost:5173');
            $redirectUrl = "{$frontendUrl}{$dashboardPath}?token={$token}";

            return redirect($redirectUrl);

        } catch (\Exception $e) {
            Log::error('SSO callback error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memproses login SSO',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Sync user from SSO data to local database
     */
    private function syncUserFromSso(array $ssoUserData): User
    {
        $email = $ssoUserData['email'];
        $ssoId = $ssoUserData['id'] ?? null;
        $roleSlug = $ssoUserData['role'] ?? 'staff';
        $dinasName = $ssoUserData['dinas'] ?? null;

        // Find or create role
        $role = Role::firstOrCreate(
            ['slug' => $roleSlug],
            [
                'name' => ucwords(str_replace('_', ' ', $roleSlug)),
                'description' => "Role from SSO: {$roleSlug}",
            ]
        );

        // Find dinas if provided
        $dinasId = null;
        if ($dinasName) {
            $dinas = Dinas::firstOrCreate(
                ['name' => $dinasName],
                [
                    'type' => $this->detectDinasType($dinasName),
                    'address' => null,
                ]
            );
            $dinasId = $dinas->id;
        }

        // Create or update user
        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $ssoUserData['name'],
                'nip' => $ssoUserData['nip'] ?? null,
                'jenis_kelamin' => $ssoUserData['jenis_kelamin'] ?? null,
                'role_id' => $role->id,
                'dinas_id' => $dinasId,
                'unit_kerja' => $ssoUserData['unit_kerja'] ?? null,
                'sso_id' => $ssoId,
                'password' => null, // SSO users don't need local password
            ]
        );

        Log::info('User synced from SSO', [
            'user_id' => $user->id,
            'email' => $user->email,
            'sso_id' => $ssoId,
        ]);

        return $user;
    }

    /**
     * Detect dinas type from name
     */
    private function detectDinasType(string $name): string
    {
        $nameLower = strtolower($name);

        if (str_contains($nameLower, 'diskominfo') || str_contains($nameLower, 'komunikasi dan informatika')) {
            return 'diskominfo';
        }

        if (str_contains($nameLower, 'badan') || str_contains($nameLower, 'inspektorat')) {
            return 'badan';
        }

        return 'dinas';
    }

    /**
     * API endpoint untuk testing SSO callback (returns JSON instead of redirect)
     */
    public function callbackApi(Request $request)
    {
        $ssoToken = $request->input('token') ?? $request->query('token');

        if (!$ssoToken) {
            return response()->json([
                'success' => false,
                'message' => 'Token SSO tidak ditemukan',
            ], 400);
        }

        try {
            // Verify token with SSO API
            $response = Http::timeout(30)
                ->withHeaders([
                    'Authorization' => "Bearer {$ssoToken}",
                    'Accept' => 'application/json',
                ])
                ->get('https://api.bispro.digitaltech.my.id/api/v2/auth/me');

            if (!$response->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token SSO tidak valid',
                    'sso_status' => $response->status(),
                ], 401);
            }

            $ssoData = $response->json();
            $userData = $ssoData['data'] ?? null;

            if (!$userData || !isset($userData['email'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data user tidak lengkap dari SSO',
                ], 400);
            }

            // Sync user
            $user = $this->syncUserFromSso($userData);

            // Generate token
            $token = $user->createToken('sso-login')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login SSO berhasil',
                'data' => [
                    'token' => $token,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'nip' => $user->nip,
                        'role' => $user->roleObj?->slug,
                        'dinas' => $user->dinas?->name,
                    ],
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('SSO callback API error', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memproses login SSO',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
