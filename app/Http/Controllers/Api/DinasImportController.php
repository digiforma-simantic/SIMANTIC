<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DinasImportService;
use Illuminate\Http\Request;

class DinasImportController extends Controller
{
    protected $importService;

    public function __construct(DinasImportService $importService)
    {
        $this->importService = $importService;
    }

    /**
     * POST /api/v1/import/dinas
     * 
     * Import dinas dari SSO API
     * 
     * @OA\Post(
     *   path="/api/v1/import/dinas",
     *   tags={"Master Data"},
     *   summary="Import Dinas dari SSO API",
     *   description="Sync data dinas/OPD dari SSO API ke database lokal SIMANTIC",
     *   security={{"bearerAuth":{}}},
     *   @OA\Response(
     *     response=200,
     *     description="Import berhasil",
     *     @OA\JsonContent(
     *       @OA\Property(property="success", type="boolean", example=true),
     *       @OA\Property(property="imported", type="integer", example=5),
     *       @OA\Property(property="updated", type="integer", example=3),
     *       @OA\Property(property="total", type="integer", example=8),
     *       @OA\Property(property="errors", type="array", @OA\Items(type="string")),
     *       @OA\Property(property="message", type="string", example="Import completed: 5 created, 3 updated")
     *     )
     *   ),
     *   @OA\Response(response=500, description="Server error")
     * )
     */
    public function import(Request $request)
    {
        $result = $this->importService->importFromSsoApi();

        $statusCode = $result['success'] ? 200 : 500;

        return response()->json($result, $statusCode);
    }
}
