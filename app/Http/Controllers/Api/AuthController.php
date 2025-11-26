<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    public function SSOCallback(Request $request){
        $token = $request->input('token');
        $respon = Http::withHeaders([
            'Authorization'=> 'Bearer ' . $token
            
        ])->get('xx.com/api/v1/auth/me')->json();

        $email=$respon['email'];
        $user = User::where('email',$email)->exists();

        if($user)
        {
            $xxx = User::where('email',$email)->first();
        $yyy = $xxx->createToken('dev-token')->plainTextToken;

        }
        else{

            $xxx = User::create([
                'name'=> $respon['name'],
                'email'=> $respon['email'],
                'password'=> Hash::make("123"),
            ]);
                $yyy = $xxx->createToken('dev-token')->plainTextToken;
        }
        return response()->json([
            'message' => "berhasil login",
            'token' => $yyy

        ]);

        
    }
}
