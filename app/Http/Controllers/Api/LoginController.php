<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    /**
     * Login user aplikasi dengan email & password, return token dan data user lengkap (role, dinas, dsb)
     */
    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::with(['roleObj', 'dinas'])->where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json([
                'message' => 'Email atau password salah',
            ], 401);
        }

        // Hapus token lama (opsional)
        $user->tokens()->delete();

        // Generate token Sanctum baru
        $token = $user->createToken('app-login')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'            => $user->id,
                'name'          => $user->name,
                'email'         => $user->email,
                'nip'           => $user->nip,
                'jenis_kelamin' => $user->jenis_kelamin,
                'unit_kerja'    => $user->unit_kerja,
                'role'          => $user->roleObj?->slug ?? $user->role,
                'roleObj'       => $user->roleObj ? [
                    'id'   => $user->roleObj->id,
                    'slug' => $user->roleObj->slug,
                    'name' => $user->roleObj->name,
                ] : null,
                'dinas'    => $user->dinas ? [
                    'id'   => $user->dinas->id,
                    'name' => $user->dinas->name,
                ] : null,
                'dinas_id' => $user->dinas_id,
                'sso_id'   => $user->sso_id,
            ],
        ], 200);
    }
}
