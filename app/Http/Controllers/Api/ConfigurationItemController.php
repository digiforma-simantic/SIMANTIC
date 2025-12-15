<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConfigurationItem;
use Illuminate\Http\Request;

// ...existing code...
class ConfigurationItemController extends Controller
{
    // ...existing code...
    public function externalAssets(Request $request)
    {
        $user = $request->user();
        $token = \Cache::get("siprima_token_for_user_{$user->id}");
        if (!$token) {
            // Bisa trigger sync ulang ke SIPRIMA, atau return error
            return response()->json([
                'success' => false,
                'message' => 'Token SIPRIMA tidak ditemukan. Silakan login ulang atau lakukan sinkronisasi.',
            ], 401);
        }

        $resp = \Http::withToken($token)
            ->acceptJson()
            ->get('https://api.siprima.digitaltech.my.id/api/assets');

        if (!$resp->successful()) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal fetch data dari SIPRIMA',
                'detail' => $resp->body(),
            ], 502);
        }

        return response()->json([
            'success' => true,
            'data' => $resp->json(),
        ]);
    }

    // ...existing code...
    public function index(Request $request)
    {
        $query = ConfigurationItem::with('ownerDinas');

        $userDinasId = $request->user()->dinas_id ?? null;
        if ($userDinasId) {
            $query->where('owner_dinas_id', $userDinasId);
        }

        if ($type = $request->query('type')) {
            $query->where('type', $type);
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $items = $query
            ->orderBy('criticality', 'desc')
            ->orderBy('name')
            ->get();

        return response()->json($items);
    }

    // ...existing code...
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'ci_code'     => 'required|string|max:50|unique:configuration_items,ci_code',
            'type'        => 'required|string|max:100',
            'environment' => 'required|in:production,staging,development',
            'criticality' => 'required|in:low,medium,high,critical',
            'status'      => 'required|in:active,under_change,retired,maintenance',
            'version'     => 'nullable|string|max:100',
            'os_name'     => 'nullable|string|max:100',
            'ip_address'  => 'nullable|ip',
            'relation_note' => 'nullable|string',
        ]);

        $userDinasId = $request->user()->dinas_id ?? $request->user()->opd_id;
        if (!$userDinasId) {
            return response()->json(['message' => 'User has no OPD assigned'], 422);
        }

        $data['owner_dinas_id'] = $request->user()->dinas_id;
        // default awal, nanti bisa di-update dari risk register
        $data['risk_level']   = $data['criticality'] ?? 'low';

        $ci = ConfigurationItem::create($data);

        return response()->json($ci, 201);
    }

    // ...existing code...
    public function show(ConfigurationItem $config_item)
    {
        $config_item->load([
            'ownerDinas',
            'risks',
            'sourceRelations.target',
            'targetRelations.source',
            'patchDeployments',
        ]);

        return response()->json($config_item);
    }

    // ...existing code...
    public function update(Request $request, ConfigurationItem $config_item)
    {
        $data = $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'ci_code'     => 'sometimes|required|string|max:50|unique:configuration_items,ci_code,' . $config_item->id,
            'type'        => 'sometimes|required|string|max:100',
            'environment' => 'sometimes|required|in:production,staging,development',
            'criticality' => 'sometimes|required|in:low,medium,high,critical',
            'status'      => 'sometimes|required|in:active,under_change,retired,maintenance',
            'version'     => 'nullable|string|max:100',
            'os_name'     => 'nullable|string|max:100',
            'ip_address'  => 'nullable|ip',
            'relation_note' => 'nullable|string',
        ]);

        $config_item->update($data);

        return response()->json($config_item);
    }

    // ...existing code...
    public function updateConfiguration(Request $request, ConfigurationItem $config_item)
    {
        $data = $request->validate([
            'ci_code'       => 'required|string|max:50|unique:configuration_items,ci_code,' . $config_item->id,
            'version'       => 'nullable|string|max:100',
            'os_name'       => 'nullable|string|max:100',
            'ip_address'    => 'nullable|ip',
            'relation_note' => 'nullable|string',
            'penanggung_jawab' => 'nullable|string|max:255',
            'lokasi'        => 'nullable|string|max:255',
            'status'        => 'nullable|string|in:active,inactive,maintenance,retired',
            'subkategori'   => 'nullable|string|max:100',
            'risk_level'    => 'nullable|integer|min:1|max:5',
        ]);

        $config_item->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Konfigurasi berhasil disimpan',
            'data'    => $config_item->fresh(),
        ]);
    }

    // ...existing code...
    public function destroy(ConfigurationItem $config_item)
    {
        $config_item->delete();

        return response()->json(['message' => 'Configuration item deleted']);
    }
}
