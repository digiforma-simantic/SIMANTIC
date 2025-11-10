<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PatchCatalog;

/**
 * @OA\Tag(
 *     name="Patch Catalog",
 *     description="Manajemen katalog patch dari vendor (kode patch, severity, catatan)"
 * )
 */
class PatchCatalogController extends Controller
{
    /**
     * GET /api/v1/patch-catalogs
     *
     * @OA\Get(
     *   path="/api/v1/patch-catalogs",
     *   tags={"Patch Catalog"},
     *   summary="Daftar patch catalog",
     *   security={{"bearerAuth":{}}},
     *   @OA\Response(
     *     response=200,
     *     description="List patch catalog",
     *     @OA\JsonContent(
     *       type="array",
     *       @OA\Items(
     *         @OA\Property(property="id", type="integer", example=1),
     *         @OA\Property(property="vendor", type="string", example="Microsoft"),
     *         @OA\Property(property="patch_code", type="string", example="KB5030219"),
     *         @OA\Property(property="severity", type="string", example="critical"),
     *         @OA\Property(property="notes", type="string", example="Security cumulative update November 2025")
     *       )
     *     )
     *   )
     * )
     */
    public function index()
    {
        $catalogs = PatchCatalog::orderByDesc('created_at')->get();

        return response()->json($catalogs);
    }

    /**
     * POST /api/v1/patch-catalogs
     *
     * @OA\Post(
     *   path="/api/v1/patch-catalogs",
     *   tags={"Patch Catalog"},
     *   summary="Menambahkan patch catalog baru",
     *   security={{"bearerAuth":{}}},
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"vendor","patch_code","severity"},
     *       @OA\Property(property="vendor", type="string", example="Microsoft"),
     *       @OA\Property(property="patch_code", type="string", example="KB5030219"),
     *       @OA\Property(
     *         property="severity",
     *         type="string",
     *         example="critical",
     *         enum={"low","medium","high","critical"}
     *       ),
     *       @OA\Property(
     *         property="notes",
     *         type="string",
     *         example="Security cumulative update November 2025"
     *       )
     *     )
     *   ),
     *   @OA\Response(
     *     response=201,
     *     description="Patch catalog berhasil ditambahkan",
     *     @OA\JsonContent(
     *       @OA\Property(property="id", type="integer", example=1),
     *       @OA\Property(property="vendor", type="string", example="Microsoft"),
     *       @OA\Property(property="patch_code", type="string", example="KB5030219"),
     *       @OA\Property(property="severity", type="string", example="critical")
     *     )
     *   ),
     *   @OA\Response(response=422, description="Validasi gagal")
     * )
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'vendor'     => 'required|string|max:100',
            'patch_code' => 'required|string|max:100',
            'severity'   => 'required|in:low,medium,high,critical',
            'notes'      => 'nullable|string|max:500',
        ]);

        $catalog = PatchCatalog::create($data);

        return response()->json($catalog, 201);
    }

    /**
     * GET /api/v1/patch-catalogs/{patch_catalog}
     *
     * @OA\Get(
     *   path="/api/v1/patch-catalogs/{id}",
     *   tags={"Patch Catalog"},
     *   summary="Detail satu patch catalog",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(
     *     name="id",
     *     in="path",
     *     required=true,
     *     description="ID patch catalog",
     *     @OA\Schema(type="integer", example=1)
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Detail patch catalog",
     *     @OA\JsonContent(
     *       @OA\Property(property="id", type="integer", example=1),
     *       @OA\Property(property="vendor", type="string", example="Microsoft"),
     *       @OA\Property(property="patch_code", type="string", example="KB5030219"),
     *       @OA\Property(property="severity", type="string", example="critical"),
     *       @OA\Property(property="notes", type="string", example="Security cumulative update November 2025")
     *     )
     *   ),
     *   @OA\Response(response=404, description="Patch catalog tidak ditemukan")
     * )
     */
    public function show(PatchCatalog $patch_catalog)
    {
        return response()->json($patch_catalog);
    }
}
