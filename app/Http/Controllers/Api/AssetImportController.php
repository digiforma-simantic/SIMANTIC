<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AssetImportService;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Asset Import",
 *     description="Import assets from external API to Configuration Items"
 * )
 */
class AssetImportController extends Controller
{
    protected $importService;

    public function __construct(AssetImportService $importService)
    {
        $this->importService = $importService;
    }

    /**
     * Import assets from external API
     *
     * @OA\Post(
     *     path="/api/v1/import/assets",
     *     tags={"Asset Import"},
     *     summary="Import assets from external API",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             @OA\Property(property="token", type="string", description="Optional API token override")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Assets imported successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Assets imported successfully"),
     *             @OA\Property(property="imported", type="integer", example=10),
     *             @OA\Property(property="updated", type="integer", example=5),
     *             @OA\Property(property="total", type="integer", example=15)
     *         )
     *     ),
     *     @OA\Response(response=500, description="Import failed")
     * )
     */
    public function import(Request $request)
    {
        $token = $request->input('token');
        
        $result = $this->importService->importFromAssetApi($token);

        $statusCode = $result['success'] ? 200 : 500;

        return response()->json($result, $statusCode);
    }
}
