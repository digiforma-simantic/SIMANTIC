<?php

namespace App\Http\Controllers\Api\v3;

use App\Http\Controllers\Controller;
use App\Models\ConfigurationItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class ConfigurationItemController extends Controller
{
    /**
     * ============================
     * GET ALL CONFIGURATION ITEMS
     * ============================
     */
    public function index()
    {
        $items = ConfigurationItem::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data'    => $items,
        ]);
    }

    /**
     * ============================
     * STORE CONFIGURATION ITEM
     * ============================
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'              => 'required|string',
            'asset_id'          => 'nullable|string',
            'ci_code'           => 'required|string|unique:configuration_items,ci_code',
            'relation_note'     => 'required|string',

            'version'           => 'nullable|string',
            'os_name'           => 'nullable|string',
            'ip_address'        => 'nullable|string',
            'subkategori'       => 'nullable|string',
            'lokasi'            => 'nullable|string',
            'penanggung_jawab'  => 'nullable|string',
            'is_usage'          => 'nullable|string',
            'owner_id'          => 'nullable|string'
        ]);

        $ci = ConfigurationItem::create([
            'name'              => $validated['name'],
            'asset_id'          => $validated['asset_id'] ?? null,
            'ci_code'           => $validated['ci_code'],
            'relation_note'     => $validated['relation_note'],

            'version'           => $validated['version'] ?? null,
            'os_name'           => $validated['os_name'] ?? null,
            'ip_address'        => $validated['ip_address'] ?? null,
            'subkategori'       => $validated['subkategori'] ?? null,
            'lokasi'            => $validated['lokasi'] ?? null,
            'penanggung_jawab'  => $validated['penanggung_jawab'] ?? null,
            'is_usage'          => $validated['is_usage'] ?? null,
            'owner_id'          => $validated['owner_id'] ?? null,

            // DEFAULT CMDB VALUES
            'type'              => 'asset',
            'environment'       => 'production',
            'criticality'       => 'medium',
            'status'            => 'active',
            'risk_level'        => 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Configuration Item berhasil dibuat',
            'data'    => $ci,
        ], 201);
    }

    /**
     * ============================
     * SHOW DETAIL
     * ============================
     */
    public function show($id)
    {
        $ci = ConfigurationItem::findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $ci,
        ]);
    }

    public function update(Request $request, $id)
    {
        // ================= CARI CI =================
        $ci = ConfigurationItem::find($id);

        if (!$ci) {
            return response()->json([
                'success' => false,
                'message' => 'Configuration Item tidak ditemukan'
            ], 404);
        }

        // ================= VALIDASI =================
        $validator = Validator::make($request->all(), [
            'ci_code'         => 'required|string|max:100',
            'version'         => 'nullable|string|max:50',
            'os_name'         => 'nullable|string|max:100',
            'ip_address'      => 'nullable|string|max:50',
            'relation_note'   => 'required|string',
            'owner_id'        => 'nullable|exists:users,id',

            // snapshot asset
            'subkategori'     => 'nullable|string|max:100',
            'lokasi'          => 'nullable|string|max:150',
            'penanggung_jawab'=> 'nullable|string|max:150',
            'is_usage'        => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors()
            ], 422);
        }

        // ================= UPDATE CI =================
        $ci->update([
            'ci_code'         => $request->ci_code,
            'version'         => $request->version,
            'os_name'         => $request->os_name,
            'ip_address'      => $request->ip_address,
            'relation_note'   => $request->relation_note,
            'owner_id'        => $request->owner_id,

            // snapshot asset
            'subkategori'      => $request->subkategori,
            'lokasi'           => $request->lokasi,
            'penanggung_jawab' => $request->penanggung_jawab,
            'is_usage'         => $request->is_usage,
        ]);

        // ================= RESPONSE =================
        return response()->json([
            'success' => true,
            'message' => 'Configuration Item berhasil diperbarui',
            'data'    => $ci
        ], 200);
    }

    /**
     * ============================
     * SHOW DETAIL BY KODE BMD
     * ============================
     */
    public function showByKodeBmd($kodeBmd)
    {
        $ci = ConfigurationItem::where('asset_id', $kodeBmd)->firstOrFail();

        return response()->json([
            'success' => true,
            'data'    => $ci,
        ]);
    }

    public function showByAssetId($assetId)
    {
        $ci = ConfigurationItem::where('asset_id', $assetId)->first();

        if (!$ci) {
            return response()->json([
                'success' => false,
                'message' => 'CI tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $ci
        ]);
    }

    public function getByUserId($userId)
    {
        $items = ConfigurationItem::where('owner_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $items,
        ]);
    }

}