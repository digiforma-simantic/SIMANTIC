<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

/**
 * @OA\Tag(
 *     name="Auth",
 *     description="Endpoints untuk autentikasi, SSO dan token"
 * )
 * @OA\Get(
 *     path="/api/sso/callback",
 *     tags={"Auth"},
 *     summary="SSO callback - exchange SSO token for API token",
 *     description="Mengambil token SSO (query parameter 'token') dan memanggil service SSO untuk mengambil data user. Jika user belum ada, sistem membuat user baru dan mengembalikan token Sanctum.",
 *     @OA\Parameter(
 *         name="token",
 *         in="query",
 *         description="Token SSO yang diterima dari provider SSO",
 *         required=true,
 *         @OA\Schema(type="string", example="eyJhbGciOi..." )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Berhasil: mengembalikan token API (Sanctum)",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="message", type="string", example="berhasil login"),
 *             @OA\Property(property="token", type="string", example="1|Vu0OZSgnHGwGGVaNxsHd7ojSYsipuxrIMlXqAiSOdd4034d1")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Bad Request: token tidak disediakan atau request SSO bermasalah",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="message", type="string", example="Invalid SSO token")
 *         )
 *     ),
 * )
 */
class AuthController extends Controller
{
    public function SSOCallback(Request $request)
    {
        // Ambil token SSO dari request (hanya untuk verifikasi ke SSO, BUKAN untuk auth:sanctum)
        $token = $request->input('token');

        if (!$token) {
            return response()->json([
                'message' => 'Token SSO tidak ditemukan'
            ], 400);
        }

        try {
            // 1. Verifikasi token SSO ke server SSO
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token
            ])->get('https://api.bispro.digitaltech.my.id/api/v2/auth/me')->json();

            if (!$response || !isset($response['data']['user'])) {
                Log::error('Invalid SSO response structure.', ['response' => $response]);
                return response()->json([
                    'message' => 'Invalid SSO response'
                ], 400);
            }

            $ssoUserData = $response['data']['user'];

            // 2. Sinkronisasi user ke database lokal
            $ssoId = $ssoUserData['id'] ?? null;
            $email = $ssoUserData['email'] ?? null;
            $name = $ssoUserData['name'] ?? 'No Name';
            $nip = $ssoUserData['nip'] ?? null;
            $jenisKelamin = $ssoUserData['jenis_kelamin'] ?? null;
            $role = $ssoUserData['role'] ?? null;
            $dinasData = $ssoUserData['dinas'] ?? null;
            $unitKerja = $ssoUserData['unit_kerja'] ?? null;
            $dinasName = is_array($dinasData) ? ($dinasData['nama'] ?? $dinasData['name'] ?? null) : $dinasData;

            if (!$ssoId || !$email) {
                Log::error('SSO response missing required fields.', ['sso_user_data' => $ssoUserData]);
                return response()->json(['message' => 'Data pengguna dari SSO tidak lengkap'], 400);
            }

            $user = User::where('sso_id', $ssoId)->first();
            if (!$user) {
                $user = User::where('email', $email)->first();
            }

            $userData = [
                'name'              => $name,
                'email'             => $email,
                'sso_id'            => $ssoId,
                'nip'               => $nip,
                'jenis_kelamin'     => $jenisKelamin,
                'role'              => $role,
                'dinas'             => $dinasName,
                'unit_kerja_string' => $unitKerja,
            ];

            if (!$user) {
                // Buat user baru jika tidak ada
                $userData['password'] = Hash::make(bin2hex(random_bytes(16)));
                $user = User::create($userData);
            } else {
                // Update data user yang sudah ada
                $user->update($userData);
            }
        } catch (\Exception $e) {
            Log::error('SSO callback failed', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Gagal memproses login SSO',
                'error' => $e->getMessage()
            ], 500);
        }

        // 3. Setelah user terverifikasi, BUAT token Sanctum lokal (JANGAN gunakan token SSO untuk auth:sanctum)
        $tokenApi = $user->createToken('dev-token')->plainTextToken;

        // 4. Kembalikan token Sanctum ke frontend (hanya token ini yang boleh dipakai untuk Bearer auth:sanctum)
        return response()->json([
            'message' => 'berhasil login',
            'token'   => $tokenApi,
        ]);
    }

    /**
     * Direct login from SSO portal
     * SSO will redirect user to this endpoint with token
     * Then redirect to frontend with token in URL
     * 
     * @OA\Get(
     *     path="/api/v1/auth/sso/direct-login",
     *     tags={"Auth"},
     *     summary="Direct login from SSO portal",
     *     description="SSO portal redirects user here with token, then redirect to frontend app",
     *     @OA\Parameter(
     *         name="token",
     *         in="query",
     *         description="Token from SSO provider",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="redirect",
     *         in="query",
     *         description="Frontend path to redirect after login",
     *         required=false,
     *         @OA\Schema(type="string", example="/dashboard")
     *     ),
     *     @OA\Response(
     *         response=302,
     *         description="Redirect to frontend with token"
     *     )
     * )
     */
    public function directLogin(Request $request)
    {
        $token = $request->input('token');
        $redirectPath = $request->input('redirect', '/');

        if (!$token) {
            return response()->json([
                'message' => 'Token SSO tidak ditemukan'
            ], 400);
        }

        try {
            // Panggil API SSO untuk validasi token dan ambil data user
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token
            ])->get('https://api.bispro.digitaltech.my.id/api/v2/auth/me')->json();

            if (!$response || !isset($response['data']['user'])) {
                Log::error('Invalid SSO response structure in directLogin.', ['response' => $response]);
                return response()->json([
                    'message' => 'Invalid SSO response'
                ], 400);
            }

            $ssoUserData = $response['data']['user'];

            // Ekstrak data dari SSO
            $ssoId = $ssoUserData['id'] ?? null;
            $email = $ssoUserData['email'] ?? null;
            $name = $ssoUserData['name'] ?? 'No Name';
            $nip = $ssoUserData['nip'] ?? null;
            $jenisKelamin = $ssoUserData['jenis_kelamin'] ?? null;
            $role = $ssoUserData['role'] ?? null;
            $dinasData = $ssoUserData['dinas'] ?? null;
            $unitKerja = $ssoUserData['unit_kerja'] ?? null;

            // Ambil nama dinas jika 'dinas' adalah array/object
            $dinasName = is_array($dinasData) ? ($dinasData['nama'] ?? $dinasData['name'] ?? null) : $dinasData;
            
            if (!$ssoId || !$email) {
                Log::error('SSO response missing required fields in directLogin.', ['sso_user_data' => $ssoUserData]);
                return response()->json(['message' => 'Data pengguna dari SSO tidak lengkap'], 400);
            }

            // Cari user berdasarkan sso_id, fallback ke email
            $user = User::where('sso_id', $ssoId)->first();
            if (!$user) {
                $user = User::where('email', $email)->first();
            }

            $userData = [
                'name'              => $name,
                'email'             => $email,
                'sso_id'            => $ssoId,
                'nip'               => $nip,
                'jenis_kelamin'     => $jenisKelamin,
                'role'              => $role,
                'dinas'             => $dinasName,
                'unit_kerja_string' => $unitKerja,
            ];

            if (!$user) {
                // Buat user baru jika tidak ada
                $userData['password'] = Hash::make(bin2hex(random_bytes(16)));
                $user = User::create($userData);
            } else {
                // Update data user yang sudah ada
                $user->update($userData);
            }
        } catch (\Exception $e) {
            Log::error('SSO directLogin failed', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            // Redirect to a frontend error page or return a JSON response
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return redirect($frontendUrl . '/login?error=sso_failed');
        }

        // Buat token Sanctum
        $apiToken = $user->createToken('sso-login')->plainTextToken;

        // Redirect ke frontend dengan token
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        $redirectUrl = $frontendUrl . $redirectPath . '?token=' . $apiToken;

        return redirect($redirectUrl);
    }
}
