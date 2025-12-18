<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Dinas;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SsoCallbackController extends Controller
{
    public function callback(Request $request)
    {
        $ssoToken = $request->query('token');

        // return $ssoToken;

        if (!$ssoToken) {
            return abort(400, 'Token SSO tidak ditemukan');
        }

        try {
            /* =====================================================
             * 1. VERIFIKASI TOKEN KE SSO PUSAT
             * ===================================================== */
            $resp = Http::timeout(30)
                ->acceptJson()
                ->withToken($ssoToken)
                ->get('https://api.bispro.digitaltech.my.id/api/v2/auth/me');

            if ($resp->status() === 401 || $resp->status() === 403) {
                Log::warning('SSO TOKEN INVALID / EXPIRED', [
                    'status' => $resp->status(),
                    'body'   => $resp->body(),
                ]);

                // Redirect balik ke SSO pusat
                return redirect()->away('https://bispro.digitaltech.my.id');
            }

            if (!$resp->successful()) {
                Log::error('SSO API ERROR', [
                    'status' => $resp->status(),
                    'body'   => $resp->body(),
                ]);

                return abort(500, 'SSO service error');
            }

            $ssoData  = $resp->json();
            Log::info('SSO CALLBACK DATA', ['data' => $ssoData]);
            $userData = $ssoData['data']['user'] ?? null;
            Log::info('SSO CALLBACK USER DATA', ['user' => $userData]);

            if (
                !$userData ||
                !isset($userData['id'], $userData['email'])
            ) {
                return abort(400, 'Data user SSO tidak lengkap');
            }

            /* =====================================================
             * 2. CREATE / UPDATE USER SIMANTIC
             * ===================================================== */
            $user = User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'password'=> bcrypt("password123"),
                    'name'    => $userData['name'] ?? '',
                    'sso_id'  => $userData['id'],
                    'nip'     => $userData['nip'] ?? null,
                    'role'    => $userData['role'] ?? 'staff',
                ]
            );

            $role = Role::updateOrCreate(
                ['slug' => $userData['role'] ?? 'staff'],
                ['name' => ucfirst(str_replace('_', ' ', $userData['role'] ?? 'staff'))]
            );


            $dinas = Dinas::updateOrCreate(
                ['name' => $userData['dinas'] ?? ''],
                []
            );

            /* =====================================================
             * 3. BUAT TOKEN LOGIN SIMANTIC (SANCTUM)
             * ===================================================== */
            // Hapus token lama (hindari token numpuk)
            $user->tokens()->delete();

            $simanticToken = $user
                ->createToken('sso-login')
                ->plainTextToken;

            /* =====================================================
             * 4. TENTUKAN DASHBOARD BERDASARKAN ROLE
             * ===================================================== */
            $roleSlug = $user->role ?? 'staff';
            Log::info('SSO CALLBACK USER ROLE', ['role' => $roleSlug]);

            $roleToDashboard = [
                'admin_kota'     => '/diskominfo/dashboarddiskominfo',
                'admin_dinas'    => '/Admin/dashboardadmin',
                'auditor'        => '/auditor/dashboardauditor',
                'kepala_seksi'   => '/Kasi/dashboardkasi',
                'kepala_dinas'   => '/Kadis/dashboardkadis',
                'kepala_bidang'  => '/Kabid/dashboardkabid',
                'staff'          => '/staff/dashboardstaff',
            ];

            $dashboardPath = $roleToDashboard[$roleSlug]
                ?? '/staff/dashboardstaff';

            /* =====================================================
             * 5. REDIRECT KE FRONTEND + TOKEN
             * ===================================================== */
            $frontendUrl = config('app.frontend_url');
            // $frontendUrl = "http://localhost:5173";

            $userPayload = [
                'id'            => $user->id,
                'name'          => $user->name,
                'email'         => $user->email,
                'nip'           => $user->nip,
                'role'          => $roleSlug,
                'jenis_kelamin' => $user->jenis_kelamin,
                'dinas'         => $user->dinas,
                'unit_kerja'    => $user->unit_kerja,
                'created_at'    => $user->created_at,
            ];
            
            Log::info('SSO CALLBACK REDIRECT', [
                'frontend_url'   => $frontendUrl,
                'simantic_token' => $simanticToken,
                'dashboard_path' => $dashboardPath,
                'user'           => $user,
                'role'           => $roleSlug,
            ]);
            return redirect()->away(
                $frontendUrl . '/sso/callback?' . http_build_query([
                    'token' => $simanticToken,
                    'path'  => $dashboardPath,
                    'user'  => base64_encode(json_encode($userPayload)),
                    'role'  => $roleSlug,
                    'sso_token' => $ssoToken,
                    'dinas' => $dinas
                ])
            );

        } catch (\Throwable $e) {
            Log::error('SSO CALLBACK ERROR', [
                'error' => $e->getMessage(),
            ]);

            return abort(500, 'Terjadi kesalahan saat proses SSO');
        }
    }
}
