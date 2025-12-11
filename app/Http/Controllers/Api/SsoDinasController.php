<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Controller;

class SsoDinasController extends Controller
{
    /**
     * Ambil data dinas dari SSO eksternal
     * GET /api/sso/dinas
     */
    public function index(Request $request)
    {
        $url = 'https://api.bispro.digitaltech.my.id/api/v2/master/dinas';
        $response = Http::acceptJson()->get($url);
        if ($response->ok()) {
            // Asumsikan response body langsung array dinas
            return response()->json($response->json(), 200);
        } else {
            return response()->json(['message' => 'Gagal mengambil data dinas dari SSO'], 500);
        }
    }
}
