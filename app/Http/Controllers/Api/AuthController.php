<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function SSOCallback(Request $request)
    {
        // ambil token dari request
        $token = $request->input('token');

        // panggil API SSO untuk ambil data user
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->get('ssodomain.com/api/v1/auth/me')->json();

        // ambil email dari response SSO
        $email = $response['email'];

        // cek apakah user sudah ada di database
        $user = User::where('email', $email)->first();

        if (!$user) {
            // kalau belum ada, buat user baru
            $user = User::create([
                'name'     => $response['name'],
                'email'    => $response['email'],
                'password' => Hash::make('123'),
            ]);
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
