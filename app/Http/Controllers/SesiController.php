<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class SesiController extends Controller
{
    function index()
    {
        return view('login');
    }
    function login(Request $request)
    {
        $request->validate([
            'email' => 'required',
            'password' => 'required'
        ], [
            'email.required' => 'Email wajib diisi',
            'password.required' => 'Password wajib diisi',
        ]);

        $infologin = [
            'email' => $request->email,
            'password' => $request->password,
        ];

        if (Auth::attempt($infologin)) {
            if (Auth::user()->role == 'staff') {
                return redirect('opd/staff');
            } elseif (Auth::user()->role == 'admin') {
                return redirect('opd/admin');
            } elseif (Auth::user()->role == 'kepala_seksi') {  
                return redirect('opd/kepala_seksi');
            }elseif (Auth::user()->role == 'kepala_bidang') {  
                return redirect('opd/kepala_bidang');
            }elseif (Auth::user()->role == 'kepala_dinas') {  
                return redirect('opd/kepala_dinas');
            }elseif (Auth::user()->role == 'diskominfo') {  
                return redirect('opd/diskominfo');
            }elseif (Auth::user()->role == 'auditor') {  
                return redirect('opd/auditor');
            }
        } else {
            return redirect('')->withErrors('Username dan Password yang dimasukkan tidak sesuai')->withInput();
        }
    }
    function logout()
        {
            Auth::logout();
            return redirect('');
        }
}