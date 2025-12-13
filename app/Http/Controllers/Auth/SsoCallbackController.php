<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Models\Dinas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class SsoCallbackController extends Controller
{
    private function cacheKey(string $provider, int $userId): string
    {
        return "{$provider}_token_for_user_{$userId}";
    }

    /**
     * Sinkronisasi SINDRA (server-to-server).
     * Sesuaikan endpoint & param sesuai tim SINDRA.
     */
    private function syncUserFromSsoToSindra(string $ssoToken, User $user): ?string
    {
        try {
            $response = Http::timeout(30)
                ->acceptJson()
                ->get(`https://api-sindra.okkyprojects.com/api/sso/redirect?token=` . $ssoToken);

            Log::info('SINDRA sync response', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            if (!$response->successful()) {
                Log::error('SINDRA sync failed', ['status' => $response->status(), 'body' => $response->body()]);
                return null;
            }

            $json = $response->json();
            $token = $json['token'] ?? $json['access_token'] ?? ($json['data']['token'] ?? null);

            if (!$token) {
                Log::error('SINDRA sync token missing', ['body' => $response->body()]);
                return null;
            }

            Cache::put($this->cacheKey('sindra', $user->id), $token, now()->addHour());
            return $token;

        } catch (\Throwable $e) {
            Log::error('SINDRA sync exception', ['error' => $e->getMessage()]);
            return null;
        }
    }

    private function syncUserFromSsoToSiprimaByEmail(string $email): ?string
    {
        $response = \Http::asForm()->post('https://api.siprima.digitaltech.my.id/api/login', [
            'email' => $email,
            'password' => 'password123', // default password, pastikan sesuai kebijakan SIPRIMA
        ]);

        if (!$response->successful()) {
            \Log::error('Gagal login ke SIPRIMA', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
            return null;
        }

        $json = $response->json();
        $token = $json['token'] ?? $json['access_token'] ?? ($json['data']['token'] ?? null);

        if (!$token) {
            \Log::error('Token SIPRIMA tidak ditemukan di response', ['body' => $json]);
            return null;
        }

        return $token;
    }

    public function callback(Request $request)
    {
        $ssoToken = $request->query('token');
        if (!$ssoToken) {
            return response()->json(['success' => false, 'message' => 'Token SSO tidak ditemukan'], 400);
        }

        try {
            // 1) Verify ke SSO
            $resp = \Http::timeout(30)
                ->acceptJson()
                ->withToken($ssoToken)
                ->get('https://api.bispro.digitaltech.my.id/api/v2/auth/me');

            if (!$resp->successful()) {
                return response()->json(['success' => false, 'message' => 'Token SSO tidak valid'], 401);
            }

            $ssoData = $resp->json();
            $userData = $ssoData['data']['user'] ?? null;

            if (!$userData || !isset($userData['id'], $userData['email'])) {
                return response()->json(['success' => false, 'message' => 'Data user SSO tidak lengkap'], 400);
            }

            // 2) Sync user ke DB SIMANTIC
            $user = $this->syncUserFromSso($userData);

            // 3) Login ke SIPRIMA pakai email
            $siprimaToken = $this->syncUserFromSsoToSiprimaByEmail($userData['email']);

            // 4) Sinkronisasi ke SINDRA tetap pakai SSO token (jika memang endpointnya butuh token SSO)
            $sindraToken = $this->syncUserFromSsoToSindra($ssoToken, $user);

            // 5) Buat token SIMANTIC (Sanctum) untuk frontend
            $simanticToken = $user->createToken('sso-login')->plainTextToken;

            // 6) Dashboard path
            $roleToDashboard = [
                'admin_kota'     => '/diskominfo/dashboarddiskominfo',
                'admin_dinas'    => '/Admin/dashboardadmin',
                'auditor'        => '/auditor/dashboardauditor',
                'kepala_seksi'   => '/Kasi/dashboardkasi',
                'staff'          => '/staff/dashboardstaff',
                'kepala_dinas'   => '/Kadis/dashboardkadis',
                'kepala_bidang'  => '/Kabid/dashboardkabid',
                'teknisi'        => '/teknisi/dashboardstaff',
            ];

            $role = $user->roleObj?->slug ?? 'staff';
            $dashboardPath = $roleToDashboard[$role] ?? '/dashboard';

            // 7) Balikin JSON: ketiga token dikembalikan ke frontend
            return response()->json([
                'success' => true,
                'token' => $simanticToken,
                'sso_token' => $ssoToken,
                'siprima_token' => $siprimaToken,
                'sindra_token' => $sindraToken,
                'user' => $user,
                'dashboard_path' => $dashboardPath,
            ]);

        } catch (\Throwable $e) {
            \Log::error('SSO callback error', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Terjadi kesalahan SSO'], 500);
        }
    }

    private function syncUserFromSso(array $ssoUserData): User
    {
        $ssoId = $ssoUserData['id'];
        $roleSlug = $ssoUserData['role'] ?? 'staff';
        $dinasName = $ssoUserData['dinas'] ?? null;

        $role = Role::firstOrCreate(
            ['slug' => $roleSlug],
            ['name' => ucwords(str_replace('_', ' ', $roleSlug))]
        );

        $dinasId = null;
        if ($dinasName) {
            $dinas = Dinas::firstOrCreate(
                ['name' => $dinasName],
                ['type' => 'dinas', 'address' => null] // isi simpel dulu
            );
            $dinasId = $dinas->id;
        }

        return User::updateOrCreate(
            ['sso_id' => $ssoId],
            [
                'name' => $ssoUserData['name'] ?? 'Unknown',
                'email' => $ssoUserData['email'],
                'role_id' => $role->id,
                'dinas_id' => $dinasId,
                'role' => $roleSlug,
                'dinas' => $dinasName,
                'unit_kerja' => $ssoUserData['unit_kerja'] ?? null,
                // jangan null kalau kolom password NOT NULL
                'password' => $ssoUserData['email'], // atau bcrypt random, sesuaikan migrasi kamu
            ]
        );
    }
}
