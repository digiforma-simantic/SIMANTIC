<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

/**
 * @OA\Post(
 *     path="/api/auth/dev/login",
 *     tags={"Auth"},
 *     summary="Login developer (dev only)",
 *     description="Login menggunakan email dan password untuk mendapatkan Bearer token (Sanctum). 
 *         Token ini digunakan untuk mengakses endpoint API lain yang membutuhkan autentikasi.",
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"email","password"},
 *             @OA\Property(
 *                 property="email",
 *                 type="string",
 *                 format="email",
 *                 example="admin.change@example.com",
 *                 description="Email akun pengguna"
 *             ),
 *             @OA\Property(
 *                 property="password",
 *                 type="string",
 *                 format="password",
 *                 example="password123",
 *                 description="Kata sandi akun pengguna"
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Login sukses. Token Bearer dan data user dikembalikan.",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(
 *                 property="token",
 *                 type="string",
 *                 example="1|Vu0OZSgnHGwGGVaNxsHd7ojSYsipuxrIMlXqAiSOdd4034d1",
 *                 description="Token autentikasi Bearer untuk digunakan pada header Authorization"
 *             ),
 *             @OA\Property(
 *                 property="user",
 *                 type="object",
 *                 @OA\Property(property="id", type="integer", example=1),
 *                 @OA\Property(property="name", type="string", example="Admin Change"),
 *                 @OA\Property(property="email", type="string", example="admin.change@example.com"),
 *                 @OA\Property(property="role", type="string", example="admin_change"),
 *                 @OA\Property(property="opd_id", type="integer", example=1)
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Kredensial salah (email atau password tidak valid)",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="message", type="string", example="Invalid credentials")
 *         )
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validasi input gagal (email atau password kosong)",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="message", type="string", example="The email field is required.")
 *         )
 *     )
 * )
 */
class DevLoginController extends Controller
{
    /**
     * Login user dan generate token Sanctum
     */
    public function login(Request $request)
    {
        // Validasi input
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // Cari user berdasarkan email
        $user = User::where('email', $data['email'])->first();

        // Cek password
        if (!$user || ! Hash::check($data['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        // Hapus token lama (opsional agar tidak numpuk)
        $user->tokens()->delete();

        // Generate token Sanctum baru
        $token = $user->createToken('dev-token')->plainTextToken;

        // Kembalikan response sukses
        return response()->json([
            'token' => $token,
            'user'  => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
                'opd_id'=> $user->opd_id,
            ],
        ], 200);
    }
}
