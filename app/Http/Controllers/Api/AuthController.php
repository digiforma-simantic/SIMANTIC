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

        // panggil API SSO untuk ambil data user
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->get('https://api.bispro.digitaltech.my.id/api/v2/auth/me')->json();

        // ambil email & sso_id dari response SSO (bervariasi tergantung provider)
        $ssoId = $response['id'] ?? $response['sso_id'] ?? null;
        $email = $response['email'] ?? null;

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
                'name'    => $response['name'] ?? 'No Name',
                'email'   => $email ?? null,
                'password' => Hash::make('123'),
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
}
