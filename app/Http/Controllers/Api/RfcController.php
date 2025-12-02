<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rfc;
use App\Models\RiskRegister;
use App\Models\RfcAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * @OA\Tag(
 *     name="RFC",
 *     description="Manajemen Request for Change (normal, standard, emergency)"
 * )
 */
class RfcController extends Controller
{
    /**
     * GET /api/v1/rfc
     * Menampilkan daftar RFC milik OPD user login (dengan pagination).
     *
     * @OA\Get(
     *   path="/api/v1/rfc",
     *   tags={"RFC"},
     *   summary="Daftar RFC milik OPD user login",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(
     *     name="status",
     *     in="query",
     *     required=false,
     *     description="Filter status RFC (optional)",
     *     @OA\Schema(type="string", example="submitted")
     *   ),
     *   @OA\Parameter(
     *     name="per_page",
     *     in="query",
     *     required=false,
     *     description="Jumlah data per halaman, default 15",
     *     @OA\Schema(type="integer", example=15)
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Berhasil mengambil daftar RFC",
     *     @OA\JsonContent(
     *       type="object",
     *       @OA\Property(
     *         property="data",
     *         type="array",
     *         @OA\Items(
     *           @OA\Property(property="id", type="integer", example=1),
     *           @OA\Property(property="title", type="string", example="Upgrade Database SIM Pegawai"),
     *           @OA\Property(property="category", type="string", example="normal"),
     *           @OA\Property(property="urgency", type="string", example="high"),
     *           @OA\Property(property="priority", type="string", example="high"),
     *           @OA\Property(property="status", type="string", example="submitted")
     *         )
     *       ),
     *       @OA\Property(
     *         property="meta",
     *         type="object",
     *         @OA\Property(property="current_page", type="integer", example=1),
     *         @OA\Property(property="last_page", type="integer", example=5),
     *         @OA\Property(property="per_page", type="integer", example=15),
     *         @OA\Property(property="total", type="integer", example=73)
     *       )
     *     )
     *   )
     * )
     */
    public function index(Request $request)
    {
        $query = Rfc::orderBy('created_at', 'desc');

        // Keep the query simple: return RFC records without OPD/requester filtering.

        // Optional filter status
        if ($priority = $request->query('priority')) {
            $query->where('priority', $priority);
        }

        $perPage = (int) $request->query('per_page', 15);

        return $query->paginate($perPage);
    }

    /**
     * GET /api/v1/rfc/{rfc}
     * Detail RFC untuk layar approval (Kasi/Kabid/Kadis).
     *
     * @OA\Get(
     *   path="/api/v1/rfc/{id}",
     *   tags={"RFC"},
     *   summary="Detail satu RFC (lengkap)",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(
     *     name="id",
     *     in="path",
     *     required=true,
     *     description="ID RFC",
     *     @OA\Schema(type="integer", example=1)
     *   ),
     *   @OA\Response(response=200, description="Detail RFC"),
     *   @OA\Response(response=403, description="Tidak boleh melihat RFC OPD lain"),
     *   @OA\Response(response=404, description="RFC tidak ditemukan")
     * )
     */
    public function show(Request $request, Rfc $rfc)
    {
        // No OPD/requester access control required for simplified RFC model.
        // Load minimal relations if available.
        $rfc->load(['rfcAttachments']);

        return response()->json([
            'data' => [
                'id'          => $rfc->id,
                'rfc_service_id' => $rfc->rfc_service_id,

                // Detail RFC: untuk isi card di UI mobile
                'rfc_detail' => [
                    'title'           => $rfc->title,
                    'affected_asset'  => null, // nanti bisa diisi dari relasi CI
                    'description'     => $rfc->description,
                    'technician_note' => null,
                    'priority_label'  => $rfc->priority_label, // Low / Medium / High
                    'priority_code'   => $rfc->priority,       // low / medium / high
                    'asset_uuid'      => $rfc->asset_uuid,
                    'sso_id'          => $rfc->sso_id,
                    'requested_at'    => optional($rfc->requested_at)->toDateTimeString(),
                ],

                // File bukti
                'attachments' => $rfc->attachments ?? [],

                // Informasi approval berjenjang
                // Removed approval-related details in simplified RFC model
            ],
        ]);
    }

        /**
       
     * POST /api/v1/rfc
     *
     * NOTE:
     * - Kalau body mengandung "rfc_id" → dianggap request dari aplikasi SERVICE DESK.
     * - Kalau body mengandung "ci_ids" → dianggap request dari user OPD (flow lama + auto assessment).
     *
     * @OA\Post(
     *   path="/api/v1/rfc",
     *   tags={"RFC"},
     *   summary="Buat RFC baru (Service Desk) - No Authentication Required",
     *   @OA\RequestBody(
     *     required=true,
     *     description="Request dari aplikasi Service Desk",
     *     @OA\JsonContent(
     *       required={"title","priority"},
     *       @OA\Property(
     *         property="rfc_service_id",
     *         type="string",
     *         example="SD-2025-001",
     *         description="ID RFC dari aplikasi Service Desk"
     *       ),
     *       @OA\Property(
     *         property="title",
     *         type="string",
     *         maxLength=255,
     *         example="Upgrade Server Production",
     *         description="Judul RFC (required, max 255 karakter)"
     *       ),
     *       @OA\Property(
     *         property="description",
     *         type="string",
     *         example="Perlu upgrade RAM",
     *         description="Deskripsi detail RFC (nullable)"
     *       ),
     *       @OA\Property(
     *         property="priority",
     *         type="string",
     *         enum={"low","medium","high"},
     *         example="high",
     *         description="Prioritas RFC (required)"
     *       ),
     *       @OA\Property(
     *         property="attachments",
     *         type="array",
     *         @OA\Items(type="string"),
     *         example={"file1.pdf", "file2.jpg"},
     *         description="Array URL lampiran dari Service Desk (nullable)"
     *       ),
     *       @OA\Property(
     *         property="requested_at",
     *         type="string",
     *         format="date-time",
     *         example="2025-12-02 10:00:00",
     *         description="Timestamp request dibuat di Service Desk (nullable)"
     *       ),
     *       @OA\Property(
     *         property="asset_uuid",
     *         type="string",
     *         example="uuid-123",
     *         description="UUID aset terdampak (nullable)"
     *       ),
     *       @OA\Property(
     *         property="sso_id",
     *         type="string",
     *         example="sso-user-001",
     *         description="SSO ID user pemohon (nullable)"
     *       )
     *     )
     *   ),
     *   @OA\Response(
     *     response=201,
     *     description="RFC berhasil dibuat",
     *     @OA\JsonContent(
     *       @OA\Property(property="status", type="boolean", example=true),
     *       @OA\Property(property="message", type="string", example="RFC successfully created from Service Desk"),
     *       @OA\Property(
     *         property="data",
     *         type="object",
     *         @OA\Property(property="id", type="integer", example=1),
     *         @OA\Property(property="rfc_service_id", type="string", example="SD-2025-001"),
     *         @OA\Property(property="title", type="string", example="Upgrade Server Production"),
     *         @OA\Property(property="description", type="string", example="Perlu upgrade RAM"),
     *         @OA\Property(property="priority", type="string", example="high"),
     *         @OA\Property(property="attachments", type="array", @OA\Items(type="string", example="file1.pdf")),
     *         @OA\Property(property="requested_at", type="string", example="2025-12-02 10:00:00"),
     *         @OA\Property(property="asset_uuid", type="string", example="uuid-123"),
     *         @OA\Property(property="sso_id", type="string", example="sso-user-001"),
     *         @OA\Property(property="created_at", type="string", example="2025-12-02 11:00:00"),
     *         @OA\Property(property="updated_at", type="string", example="2025-12-02 11:00:00")
     *       )
     *     )
     *   ),
     *   @OA\Response(
     *     response=422,
     *     description="Validasi gagal",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="The given data was invalid."),
     *       @OA\Property(property="errors", type="object")
     *     )
     *   )
     * )
     */

    public function store(Request $request)
    {
        // Service Desk Integration - accept RFC data from external Service Desk system
        $validated = $request->validate([
            'rfc_id'             => 'nullable|string|max:255',
            'rfc_service_id'     => 'nullable|string|max:255',
            'title'              => 'required|string|max:255',
            'description'        => 'nullable|string',
            'priority'           => 'required|in:low,medium,high',
            'attachments'        => 'nullable|array',
            'attachments.*'      => 'string',
            'requested_at'       => 'nullable|date',
            'request_at'         => 'nullable|date',
            'asset_uuid'         => 'nullable|string|max:255',
            'asset_id'           => 'nullable|string|max:255', // legacy field
            'sso_id'             => 'nullable|string|max:255',
            'email'              => 'nullable|email',
        ]);

        // Map rfc_id or rfc_service_id to rfc_service_id field
        $rfcServiceId = $validated['rfc_service_id'] ?? $validated['rfc_id'] ?? null;

        // Create RFC with Service Desk fields only
        $rfc = Rfc::create([
            'rfc_service_id' => $rfcServiceId,
            'title'          => $validated['title'],
            'description'    => $validated['description'] ?? null,
            'priority'       => $validated['priority'],
            'attachments'    => $validated['attachments'] ?? null,
            'requested_at'   => $validated['requested_at'] ?? $validated['request_at'] ?? now(),
            'asset_uuid'     => $validated['asset_uuid'] ?? $validated['asset_id'] ?? null,
            'sso_id'         => $validated['sso_id'] ?? $validated['email'] ?? null,
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'RFC successfully created from Service Desk',
            'data'    => [
                'id'              => $rfc->id,
                'rfc_service_id'  => $rfc->rfc_service_id,
                'title'           => $rfc->title,
                'description'     => $rfc->description,
                'priority'        => $rfc->priority,
                'attachments'     => $rfc->attachments,
                'requested_at'    => optional($rfc->requested_at)->toDateTimeString(),
                'asset_uuid'      => $rfc->asset_uuid,
                'sso_id'          => $rfc->sso_id,
                'created_at'      => $rfc->created_at->toDateTimeString(),
                'updated_at'      => $rfc->updated_at->toDateTimeString(),
            ],
        ], 201);
    }
}