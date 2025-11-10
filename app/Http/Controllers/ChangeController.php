<?php

namespace App\Http\Controllers;

use App\Models\Rfc;
use App\Models\RiskRegister;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * @OA\Tag(
 *     name="Change Management",
 *     description="Pengelolaan Request for Change (RFC) menjadi Change Request penuh, termasuk detail dan penilaian risiko"
 * )
 */
class ChangeController extends Controller
{
    /**
     * @OA\Get(
     *   path="/api/v1/changes",
     *   tags={"Change Management"},
     *   summary="Daftar Change Request milik OPD user login",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(
     *     name="status",
     *     in="query",
     *     required=false,
     *     description="Filter status change (misal: submitted, planning, approved)",
     *     @OA\Schema(type="string", example="submitted")
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Daftar Change Request berhasil diambil",
     *     @OA\JsonContent(
     *       type="array",
     *       @OA\Items(
     *         @OA\Property(property="id", type="integer", example=101),
     *         @OA\Property(property="title", type="string", example="Upgrade Database SIM Pegawai"),
     *         @OA\Property(property="category", type="string", example="normal"),
     *         @OA\Property(property="urgency", type="string", example="high"),
     *         @OA\Property(property="priority", type="string", example="P2"),
     *         @OA\Property(property="status", type="string", example="planning")
     *       )
     *     )
     *   )
     * )
     */
    public function index(Request $request)
    {
        $query = Rfc::with(['requester', 'requesterOpd', 'configurationItems', 'assessment'])
            ->orderBy('created_at', 'desc');

        // Filter by OPD
        if ($request->user()->opd_id) {
            $query->where('requester_opd_id', $request->user()->opd_id);
        }

        // Optional filter by status
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $changes = $query->paginate(15);

        return response()->json($changes);
    }

    /**
     * @OA\Get(
     *   path="/api/v1/changes/{id}",
     *   tags={"Change Management"},
     *   summary="Menampilkan detail lengkap Change Request (RFC + Change Plan + Review)",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(
     *     name="id",
     *     in="path",
     *     required=true,
     *     description="ID Change Request",
     *     @OA\Schema(type="integer", example=101)
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Detail Change berhasil diambil",
     *     @OA\JsonContent(
     *       @OA\Property(property="id", type="integer", example=101),
     *       @OA\Property(property="title", type="string", example="Upgrade Database SIM Pegawai"),
     *       @OA\Property(property="category", type="string", example="normal"),
     *       @OA\Property(property="urgency", type="string", example="high"),
     *       @OA\Property(property="priority", type="string", example="P2"),
     *       @OA\Property(property="status", type="string", example="approved"),
     *       @OA\Property(property="requester_opd", type="string", example="Dinas Kominfo"),
     *       @OA\Property(
     *         property="configuration_items",
     *         type="array",
     *         @OA\Items(
     *           @OA\Property(property="name", type="string", example="Server SPBE 01"),
     *           @OA\Property(property="status", type="string", example="active")
     *         )
     *       )
     *     )
     *   ),
     *   @OA\Response(response=403, description="Tidak boleh melihat Change milik OPD lain"),
     *   @OA\Response(response=404, description="Change Request tidak ditemukan")
     * )
     */
    public function show(Request $request, Rfc $change)
    {
        // Batasi hanya OPD pemilik
        if ($request->user()->opd_id && $change->requester_opd_id !== $request->user()->opd_id) {
            return response()->json(['message' => 'You are not allowed to view this Change Request'], 403);
        }

        $change->load([
            'requester.opd',
            'configurationItems.ownerOpd',
            'assessment',
            'approvals.approver',
            'impactReport',
            'changePlan',
            'execution',
            'pir',
            'complianceReview',
        ]);

        return response()->json($change);
    }

    /**
     * @OA\Post(
     *   path="/api/v1/changes",
     *   tags={"Change Management"},
     *   summary="Membuat Change Request baru berdasarkan RFC dan CI terpilih",
     *   security={{"bearerAuth":{}}},
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"title","category","urgency","priority","ci_ids"},
     *       @OA\Property(property="title", type="string", example="Upgrade Database SIM Pegawai"),
     *       @OA\Property(property="description", type="string", example="Perlu upgrade PostgreSQL 14 ke 15"),
     *       @OA\Property(property="category", type="string", example="normal", enum={"normal","standard","emergency"}),
     *       @OA\Property(property="urgency", type="string", example="high", enum={"low","medium","high","critical"}),
     *       @OA\Property(property="priority", type="string", example="P2", enum={"P4","P3","P2","P1"}),
     *       @OA\Property(
     *         property="ci_ids",
     *         type="array",
     *         @OA\Items(type="integer", example=301)
     *       )
     *     )
     *   ),
     *   @OA\Response(
     *     response=201,
     *     description="Change Request berhasil dibuat",
     *     @OA\JsonContent(
     *       @OA\Property(property="id", type="integer", example=101),
     *       @OA\Property(property="title", type="string", example="Upgrade Database SIM Pegawai"),
     *       @OA\Property(property="status", type="string", example="submitted")
     *     )
     *   ),
     *   @OA\Response(response=422, description="Validasi gagal atau user belum memiliki OPD")
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
            // 1️⃣ Buat Change (RFC)
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

            // 2️⃣ Hubungkan ke CI terkait
            $rfc->configurationItems()->sync($data['ci_ids']);

            // 3️⃣ Hitung nilai risiko tertinggi dari Risk Register
            $maxRisk = RiskRegister::whereIn('ci_id', $data['ci_ids'])->max('risk_score');

            // 4️⃣ Buat assessment default
            $notes = $maxRisk !== null
                ? 'Auto-calculated from CMDB risk register.'
                : 'No risk register data found for selected CIs.';

            $rfc->assessment()->create([
                'completeness_ok'       => false,
                'suggested_change_type' => null,
                'risk_auto_score'       => $maxRisk,
                'notes'                 => $notes,
            ]);

            // 5️⃣ Load relasi untuk response
            $rfc->load(['configurationItems', 'assessment']);

            return response()->json($rfc, 201);
        });
    }
}
