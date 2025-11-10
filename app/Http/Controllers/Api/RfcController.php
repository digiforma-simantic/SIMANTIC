<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rfc;
use App\Models\RiskRegister;
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
     *           @OA\Property(property="priority", type="string", example="P2"),
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
        $query = Rfc::with(['requester', 'requesterOpd', 'configurationItems', 'assessment'])
            ->orderBy('created_at', 'desc');

        // Filter RFC hanya milik OPD user login (kecuali nanti ada role admin pusat)
        if ($request->user()->opd_id) {
            $query->where('requester_opd_id', $request->user()->opd_id);
        }

        // Optional filter status
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $perPage = (int) $request->query('per_page', 15);

        // Laravel paginator otomatis memberi struktur: data + links + meta
        return $query->paginate($perPage);
    }

        /**
     * GET /api/v1/rfc/{rfc}
     * Menampilkan detail RFC lengkap (dengan guard OPD).
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
     *   @OA\Response(
     *     response=200,
     *     description="Detail RFC",
     *     @OA\JsonContent(
     *       @OA\Property(property="id", type="integer", example=1),
     *       @OA\Property(property="title", type="string", example="Upgrade Database SIM Pegawai"),
     *       @OA\Property(property="description", type="string"),
     *       @OA\Property(property="category", type="string", example="normal"),
     *       @OA\Property(property="urgency", type="string", example="high"),
     *       @OA\Property(property="priority", type="string", example="P2"),
     *       @OA\Property(property="status", type="string", example="approved")
     *     )
     *   ),
     *   @OA\Response(response=403, description="Tidak boleh melihat RFC OPD lain"),
     *   @OA\Response(response=404, description="RFC tidak ditemukan")
     * )
     */
  
    public function show(Request $request, Rfc $rfc)
    {
        // Batasi per OPD (kecuali nanti kamu buat role admin pusat)
        if ($request->user()->opd_id && $rfc->requester_opd_id !== $request->user()->opd_id) {
            return response()->json([
                'message' => 'You are not allowed to view this RFC',
            ], 403);
        }

        $rfc->load([
            'requester.opd',
            'configurationItems.ownerOpd',
            'assessment',
            'approvals.approver',
            'impactReport',
            'changePlan',
            'execution',
            'pir',
            'complianceReview',
            'maintenanceLogs',
            'patchDeployments',
        ]);

        return response()->json($rfc);
    }

    /**
     * POST /api/v1/rfc
     * Membuat RFC baru dan menghubungkan dengan CI terkait + auto assessment.
     *
     * @OA\Post(
     *   path="/api/v1/rfc",
     *   tags={"RFC"},
     *   summary="Buat RFC baru",
     *   security={{"bearerAuth":{}}},
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"title","category","urgency","priority","ci_ids"},
     *       @OA\Property(property="title", type="string", maxLength=255, example="Upgrade Database SIM Pegawai"),
     *       @OA\Property(property="description", type="string", example="Perlu upgrade versi 13 untuk compliance."),
     *       @OA\Property(property="category", type="string", example="normal", enum={"normal","standard","emergency"}),
     *       @OA\Property(property="urgency", type="string", example="high", enum={"low","medium","high","critical"}),
     *       @OA\Property(property="priority", type="string", example="P2", enum={"P4","P3","P2","P1"}),
     *       @OA\Property(
     *         property="ci_ids",
     *         type="array",
     *         @OA\Items(type="integer", example=101),
     *         description="Daftar ID Configuration Item yang terdampak"
     *       )
     *     )
     *   ),
     *   @OA\Response(
     *     response=201,
     *     description="RFC berhasil dibuat",
     *     @OA\JsonContent(
     *       @OA\Property(property="id", type="integer", example=1),
     *       @OA\Property(property="title", type="string"),
     *       @OA\Property(property="category", type="string", example="normal"),
     *       @OA\Property(property="urgency", type="string", example="high"),
     *       @OA\Property(property="priority", type="string", example="P2"),
     *       @OA\Property(property="status", type="string", example="submitted")
     *     )
     *   ),
     *   @OA\Response(
     *     response=422,
     *     description="Validasi gagal atau user belum memiliki OPD",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="User has no OPD assigned")
     *     )
     *   )
     * )
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'category'    => 'required|in:normal,standard,emergency',
            'urgency'     => 'required|in:low,medium,high,critical',
            'priority'    => 'required|in:P4,P3,P2,P1',
            'ci_ids'      => 'required|array|min:1',
            'ci_ids.*'    => 'integer|exists:configuration_items,id',
        ]);

        if (!$request->user()->opd_id) {
            return response()->json(['message' => 'User has no OPD assigned'], 422);
        }

        return DB::transaction(function () use ($request, $data) {
            // 1️⃣ Buat RFC
            $rfc = Rfc::create([
                'title'            => $data['title'],
                'description'      => $data['description'] ?? null,
                'category'         => $data['category'],
                'urgency'          => $data['urgency'],
                'priority'         => $data['priority'],
                'status'           => 'submitted',
                'requester_id'     => $request->user()->id,
                'requester_opd_id' => $request->user()->opd_id,
            ]);

            // 2️⃣ Hubungkan RFC dengan CI (pivot table rfc_ci)
            $rfc->configurationItems()->sync($data['ci_ids']);

            // 3️⃣ Hitung nilai risiko otomatis (ambil risk tertinggi dari risk_register)
            $maxRisk = RiskRegister::whereIn('ci_id', $data['ci_ids'])->max('risk_score');

            // 4️⃣ Selalu buat assessment record (meski risk_auto_score null)
            $notes = $maxRisk !== null
                ? 'Auto-calculated from CMDB risk register.'
                : 'No risk register data found for selected CIs.';

            $rfc->assessment()->create([
                'completeness_ok'       => false,
                'suggested_change_type' => null,
                'risk_auto_score'       => $maxRisk, // bisa null
                'notes'                 => $notes,
            ]);

            // 5️⃣ Load relasi untuk response
            $rfc->load(['configurationItems', 'assessment']);

            return response()->json($rfc, 201);
        });
    }
}
