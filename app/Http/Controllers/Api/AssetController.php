<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Asset;

class AssetController extends Controller
{
    // Endpoint untuk menerima data aset dari tim aset eksternal
    public function storeFromExternal(Request $request)
    {
        $data = $request->all();

        // Mapping data dari tim aset ke field tabel assets lokal
        $asset = Asset::create([
            'aset_uuid'        => $data['kode_bmd'] ?? null,
            'nama'             => $data['nama'] ?? null,
            'lokasi'           => $data['lokasi']['nama'] ?? null,
            'penanggung_jawab' => $data['penanggungjawab']['nama'] ?? null,
            'level_resiko'     => $data['resiko'] ?? null, // pastikan field ini dikirim, jika tidak bisa mapping dari status/kondisi
            'sub_kategori'     => $data['subkategori']['nama'] ?? null,
        ]);

        Log::info('Aset baru disinkronkan dari tim aset', ['asset_id' => $asset->id]);

        return response()->json([
            'success' => true,
            'message' => 'Aset berhasil disimpan di SIMANTIC',
            'data'    => $asset,
        ], 201);
    }
}
