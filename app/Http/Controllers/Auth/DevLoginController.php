<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class DevLoginController extends Controller
{
    public function login(Request $req)
    {
        $data = $req->validate([
            'email'    => ['required','email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $data['email'])->first();
        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
        if (!$user->is_active) {
            return response()->json(['message' => 'User inactive'], 403);
        }

        $abilities = match($user->role) {
            'superadmin'  => ['*'],
            'admin_dinas' => ['changes:*','cmdb:*','patch:*','report:*'],
            'operator'    => ['changes:create','changes:read','changes:update','cmdb:read','patch:create','patch:read'],
            'auditor'     => ['changes:read','cmdb:read','report:read'],
            default       => ['changes:create','changes:read','cmdb:read'],
        };

        $token = $user->createToken('dev', $abilities)->plainTextToken;

        return response()->json([
            'token'     => $token,
            'user'      => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'dinas_id' => $user->dinas_id
            ],
            'abilities' => $abilities,
        ]);
    }
}
