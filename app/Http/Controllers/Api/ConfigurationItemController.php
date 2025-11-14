<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConfigurationItem;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="CMDB",
 *     description="Manajemen Configuration Item (CI) dan relasinya dalam CMDB"
 * )
 */
class ConfigurationItemController extends Controller
{
    /**
     * GET /api/v1/config-items
     *
     * @OA\Get(
     *   path="/api/v1/config-items",
     *   tags={"CMDB"},
     *   summary="Daftar Configuration Item (CI) milik OPD user login",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(
     *     name="type",
     *     in="query",
     *     required=false,
     *     description="Filter tipe CI (server, laptop, aplikasi, dll)",
     *     @OA\Schema(type="string", example="hardware")
     *   ),
     *   @OA\Parameter(
     *     name="status",
     *     in="query",
     *     required=false,
     *     description="Filter status CI (active, under_change, retired, maintenance)",
     *     @OA\Schema(type="string", example="active")
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="List Configuration Item",
     *     @OA\JsonContent(type="array", @OA\Items(
     *       @OA\Property(property="id", type="integer", example=245),
     *       @OA\Property(property="ci_code", type="string", example="CI-000245"),
     *       @OA\Property(property="name", type="string", example="Laptop M-25-007"),
     *       @OA\Property(property="type", type="string", example="hardware"),
     *       @OA\Property(property="environment", type="string", example="production"),
     *       @OA\Property(property="criticality", type="string", example="low"),
     *       @OA\Property(property="status", type="string", example="active"),
     *       @OA\Property(property="version", type="string", example="Firmware BIOS v1.14.2"),
     *       @OA\Property(property="os_name", type="string", example="Windows 11 Pro 64-bit"),
     *       @OA\Property(property="ip_address", type="string", example="10.10.5.123"),
     *       @OA\Property(property="relation_note", type="string", example="Laptop M-25-007 terhubung ke Server AD dan Printer Lantai 5")
     *     ))
     *   )
     * )
     */
    public function index(Request $request)
    {
        $query = ConfigurationItem::with('ownerOpd');

        if ($request->user()->opd_id) {
            $query->where('owner_opd_id', $request->user()->opd_id);
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

    /**
     * POST /api/v1/config-items
     *
     * Ini yang akan dipanggil oleh aplikasi SIMANTIC untuk menyimpan
     * konfigurasi aset (bagian bawah form: CI Code, Versi, OS, IP, Relasi).
     *
     * @OA\Post(
     *   path="/api/v1/config-items",
     *   tags={"CMDB"},
     *   summary="Menambahkan Configuration Item (CI) baru",
     *   security={{"bearerAuth":{}}},
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"name","ci_code","type","environment","criticality","status"},
     *       @OA\Property(property="name", type="string", example="Laptop M-25-007"),
     *       @OA\Property(property="ci_code", type="string", example="CI-000245"),
     *       @OA\Property(property="type", type="string", example="hardware"),
     *       @OA\Property(
     *         property="environment",
     *         type="string",
     *         example="production",
     *         enum={"production","staging","development"}
     *       ),
     *       @OA\Property(
     *         property="criticality",
     *         type="string",
     *         example="low",
     *         enum={"low","medium","high","critical"}
     *       ),
     *       @OA\Property(
     *         property="status",
     *         type="string",
     *         example="active",
     *         enum={"active","under_change","retired","maintenance"}
     *       ),
     *       @OA\Property(property="version", type="string", example="Firmware BIOS v1.14.2"),
     *       @OA\Property(property="os_name", type="string", example="Windows 11 Pro 64-bit"),
     *       @OA\Property(property="ip_address", type="string", example="10.10.5.123"),
     *       @OA\Property(
     *         property="relation_note",
     *         type="string",
     *         example="Laptop M-25-007 terhubung ke Server Active Directory dan Printer Jaringan Lantai 5"
     *       )
     *     )
     *   ),
     *   @OA\Response(
     *     response=201,
     *     description="CI berhasil dibuat",
     *     @OA\JsonContent(
     *       @OA\Property(property="id", type="integer", example=245),
     *       @OA\Property(property="ci_code", type="string", example="CI-000245")
     *     )
     *   ),
     *   @OA\Response(response=422, description="Validasi gagal")
     * )
     */
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

        if (!$request->user()->opd_id) {
            return response()->json(['message' => 'User has no OPD assigned'], 422);
        }

        $data['owner_opd_id'] = $request->user()->opd_id;
        // default awal, nanti bisa di-update dari risk register
        $data['risk_level']   = $data['criticality'] ?? 'low';

        $ci = ConfigurationItem::create($data);

        return response()->json($ci, 201);
    }

    /**
     * GET /api/v1/config-items/{config_item}
     *
     * @OA\Get(
     *   path="/api/v1/config-items/{id}",
     *   tags={"CMDB"},
     *   summary="Menampilkan detail Configuration Item (CI)",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(
     *     name="id",
     *     in="path",
     *     required=true,
     *     description="ID Configuration Item",
     *     @OA\Schema(type="integer", example=245)
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Detail CI",
     *     @OA\JsonContent(
     *       @OA\Property(property="id", type="integer", example=245),
     *       @OA\Property(property="ci_code", type="string", example="CI-000245"),
     *       @OA\Property(property="name", type="string", example="Laptop M-25-007")
     *     )
     *   ),
     *   @OA\Response(response=404, description="CI tidak ditemukan")
     * )
     */
    public function show(ConfigurationItem $config_item)
    {
        $config_item->load([
            'ownerOpd',
            'risks',
            'sourceRelations.target',
            'targetRelations.source',
            'patchDeployments',
        ]);

        return response()->json($config_item);
    }

    /**
     * PUT /api/v1/config-items/{config_item}
     *
     * @OA\Put(
     *   path="/api/v1/config-items/{id}",
     *   tags={"CMDB"},
     *   summary="Memperbarui data Configuration Item (CI)",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(
     *     name="id",
     *     in="path",
     *     required=true,
     *     description="ID Configuration Item",
     *     @OA\Schema(type="integer", example=245)
     *   ),
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       @OA\Property(property="name", type="string", example="Laptop M-25-007"),
     *       @OA\Property(property="ci_code", type="string", example="CI-000245"),
     *       @OA\Property(property="type", type="string", example="hardware"),
     *       @OA\Property(property="environment", type="string", example="production"),
     *       @OA\Property(property="criticality", type="string", example="low"),
     *       @OA\Property(property="status", type="string", example="active"),
     *       @OA\Property(property="version", type="string", example="Firmware BIOS v1.14.2"),
     *       @OA\Property(property="os_name", type="string", example="Windows 11 Pro 64-bit"),
     *       @OA\Property(property="ip_address", type="string", example="10.10.5.123"),
     *       @OA\Property(property="relation_note", type="string", example="Relasi antar aset diperbarui...")
     *     )
     *   ),
     *   @OA\Response(response=200, description="CI berhasil diperbarui"),
     *   @OA\Response(response=422, description="Validasi gagal")
     * )
     */
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

    /**
     * DELETE /api/v1/config-items/{config_item}
     *
     * @OA\Delete(
     *   path="/api/v1/config-items/{id}",
     *   tags={"CMDB"},
     *   summary="Menghapus Configuration Item (soft delete)",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(
     *     name="id",
     *     in="path",
     *     required=true,
     *     description="ID Configuration Item",
     *     @OA\Schema(type="integer", example=245)
     *   ),
     *   @OA\Response(response=200, description="CI berhasil dihapus"),
     *   @OA\Response(response=404, description="CI tidak ditemukan")
     * )
     */
    public function destroy(ConfigurationItem $config_item)
    {
        $config_item->delete();

        return response()->json(['message' => 'Configuration item deleted']);
    }
}
