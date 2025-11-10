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
     *     description="Filter berdasarkan tipe CI (misal: server, database, network)",
     *     @OA\Schema(type="string", example="server")
     *   ),
     *   @OA\Parameter(
     *     name="status",
     *     in="query",
     *     required=false,
     *     description="Filter berdasarkan status CI",
     *     @OA\Schema(type="string", example="active")
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Daftar Configuration Item berhasil diambil",
     *     @OA\JsonContent(
     *       type="array",
     *       @OA\Items(
     *         @OA\Property(property="id", type="integer", example=101),
     *         @OA\Property(property="name", type="string", example="Server SPBE 01"),
     *         @OA\Property(property="type", type="string", example="server"),
     *         @OA\Property(property="environment", type="string", example="production"),
     *         @OA\Property(property="criticality", type="string", example="high"),
     *         @OA\Property(property="status", type="string", example="active"),
     *         @OA\Property(property="version", type="string", example="v2.1.0"),
     *         @OA\Property(property="patch_level", type="string", example="KB5030219")
     *       )
     *     )
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
     * @OA\Post(
     *   path="/api/v1/config-items",
     *   tags={"CMDB"},
     *   summary="Menambahkan Configuration Item (CI) baru",
     *   security={{"bearerAuth":{}}},
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"name","type","environment","criticality","status"},
     *       @OA\Property(property="name", type="string", example="Server SPBE 01"),
     *       @OA\Property(property="type", type="string", example="server"),
     *       @OA\Property(property="environment", type="string", example="production", enum={"production","staging","development"}),
     *       @OA\Property(property="criticality", type="string", example="high", enum={"low","medium","high","critical"}),
     *       @OA\Property(property="status", type="string", example="active", enum={"active","under_change","retired","maintenance"}),
     *       @OA\Property(property="version", type="string", example="v2.1.0"),
     *       @OA\Property(property="patch_level", type="string", example="KB5030219")
     *     )
     *   ),
     *   @OA\Response(
     *     response=201,
     *     description="Configuration Item berhasil dibuat",
     *     @OA\JsonContent(
     *       @OA\Property(property="id", type="integer", example=101),
     *       @OA\Property(property="name", type="string", example="Server SPBE 01"),
     *       @OA\Property(property="status", type="string", example="active")
     *     )
     *   ),
     *   @OA\Response(response=422, description="Validasi gagal atau user belum memiliki OPD")
     * )
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'type'        => 'required|string|max:100',
            'environment' => 'required|in:production,staging,development',
            'criticality' => 'required|in:low,medium,high,critical',
            'status'      => 'required|in:active,under_change,retired,maintenance',
            'version'     => 'nullable|string|max:50',
            'patch_level' => 'nullable|string|max:50',
        ]);

        if (!$request->user()->opd_id) {
            return response()->json(['message' => 'User has no OPD assigned'], 422);
        }

        $data['owner_opd_id'] = $request->user()->opd_id;
        $data['risk_level']   = 0;

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
     *     @OA\Schema(type="integer", example=101)
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Detail CI berhasil diambil",
     *     @OA\JsonContent(
     *       @OA\Property(property="id", type="integer", example=101),
     *       @OA\Property(property="name", type="string", example="Server SPBE 01"),
     *       @OA\Property(property="type", type="string", example="server"),
     *       @OA\Property(property="status", type="string", example="active"),
     *       @OA\Property(property="criticality", type="string", example="high"),
     *       @OA\Property(property="risk_level", type="integer", example=12)
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
     * PUT/PATCH /api/v1/config-items/{config_item}
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
     *     @OA\Schema(type="integer", example=101)
     *   ),
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       @OA\Property(property="name", type="string", example="Server SPBE 01 (Updated)"),
     *       @OA\Property(property="status", type="string", example="under_change"),
     *       @OA\Property(property="version", type="string", example="v2.2.0")
     *     )
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="CI berhasil diperbarui",
     *     @OA\JsonContent(
     *       @OA\Property(property="id", type="integer", example=101),
     *       @OA\Property(property="name", type="string", example="Server SPBE 01 (Updated)")
     *     )
     *   ),
     *   @OA\Response(response=404, description="CI tidak ditemukan")
     * )
     */
    public function update(Request $request, ConfigurationItem $config_item)
    {
        $data = $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'type'        => 'sometimes|required|string|max:100',
            'environment' => 'sometimes|required|in:production,staging,development',
            'criticality' => 'sometimes|required|in:low,medium,high,critical',
            'status'      => 'sometimes|required|in:active,under_change,retired,maintenance',
            'version'     => 'nullable|string|max:50',
            'patch_level' => 'nullable|string|max:50',
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
     *     @OA\Schema(type="integer", example=101)
     *   ),
     *   @OA\Response(response=200, description="Configuration item deleted"),
     *   @OA\Response(response=404, description="CI tidak ditemukan")
     * )
     */
    public function destroy(ConfigurationItem $config_item)
    {
        $config_item->delete();

        return response()->json(['message' => 'Configuration item deleted']);
    }
}
