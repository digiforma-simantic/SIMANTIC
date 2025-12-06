<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\UserImportService;
use Illuminate\Http\Request;

class UserImportController extends Controller
{
    protected $importService;

    public function __construct(UserImportService $importService)
    {
        $this->importService = $importService;
    }

    /**
     * POST /api/v1/import/users
     * 
     * Import users dari SSO API
     * 
     * @OA\Post(
     *   path="/api/v1/import/users",
     *   tags={"Master Data"},
     *   summary="Import Users dari SSO API",
     *   description="Sync data users dari SSO API ke database lokal SIMANTIC",
     *   security={{"bearerAuth":{}}},
     *   @OA\RequestBody(
     *     required=false,
     *     @OA\JsonContent(
     *       @OA\Property(property="sso_token", type="string", description="Bearer token untuk SSO API (optional, jika tidak diisi akan pakai dari .env)")
     *     )
     *   ),
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
        $ssoToken = $request->input('sso_token');
        
        $result = $this->importService->importFromSsoApi($ssoToken);

        $statusCode = $result['success'] ? 200 : 500;

        return response()->json($result, $statusCode);
    }
}
