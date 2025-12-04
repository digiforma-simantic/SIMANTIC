<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
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
        // ambil token dari request
        $token = $request->input('token');

        if (!$token) {
            return response()->json([
                'message' => 'Token SSO tidak ditemukan'
            ], 400);
        }

        try {
            // panggil API SSO untuk ambil data user
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token
            ])->get('https://api.bispro.digitaltech.my.id/api/v2/auth/me')->json();

            if (!$response || !is_array($response)) {
                return response()->json([
                    'message' => 'Invalid SSO response'
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menghubungi SSO provider',
                'error' => $e->getMessage()
            ], 500);
        }

        // ambil email & sso_id dari response SSO (bervariasi tergantung provider)
        $ssoId = $response['id'] ?? $response['sso_id'] ?? null;
        $email = $response['email'] ?? null;
        $name = $response['name'] ?? 'No Name';

        // Prefer lookup by sso_id if available, else fallback to email
        $user = null;
        if ($ssoId) {
            $user = User::where('sso_id', $ssoId)->first();
        }
        if (!$user && $email) {
            $user = User::where('email', $email)->first();
        }

        if (! $user) {
            // if user doesn't exist, create and set sso_id
            $user = User::create([
                'name'    => $name,
                'email'   => $email ?? $ssoId . '@sso.local', // Fallback email
                'password' => Hash::make(bin2hex(random_bytes(16))), // Random password
                'sso_id'  => $ssoId,
            ]);
        } else {
            // update sso_id for existing user if missing
            if ($ssoId && empty($user->sso_id)) {
                $user->sso_id = $ssoId;
                $user->save();
            }
        }

        // buat token sanctum
        $tokenApi = $user->createToken('dev-token')->plainTextToken;

        // kirim balik ke frontend
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

            if (!$response || !is_array($response)) {
                return response()->json([
                    'message' => 'Invalid SSO response'
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menghubungi SSO provider',
                'error' => $e->getMessage()
            ], 500);
        }

        // Ambil data user dari response SSO
        $ssoId = $response['id'] ?? $response['sso_id'] ?? null;
        $email = $response['email'] ?? null;
        $name = $response['name'] ?? 'No Name';

        // Cari user berdasarkan sso_id
        $user = null;
        if ($ssoId) {
            $user = User::where('sso_id', $ssoId)->first();
        }
        if (!$user && $email) {
            $user = User::where('email', $email)->first();
        }

        if (!$user) {
            // Buat user baru - email boleh null karena SSO tidak selalu memberikan email
            $user = User::create([
                'name'     => $name,
                'email'    => $email ?? $ssoId . '@sso.local', // Fallback email jika tidak ada
                'password' => Hash::make(bin2hex(random_bytes(16))), // Random password
                'sso_id'   => $ssoId,
            ]);
        } else {
            // Update sso_id jika belum ada
            if ($ssoId && empty($user->sso_id)) {
                $user->sso_id = $ssoId;
                $user->save();
            }
        }

        // Buat token Sanctum
        $apiToken = $user->createToken('sso-login')->plainTextToken;

        // Redirect ke frontend dengan token
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        $redirectUrl = $frontendUrl . $redirectPath . '?token=' . $apiToken;

        return redirect($redirectUrl);
    }
}
