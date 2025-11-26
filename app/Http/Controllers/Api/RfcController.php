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
        // Batasi akses per OPD (kecuali nanti kamu buat role admin pusat)
        if ($request->user()->opd_id && $rfc->requester_opd_id !== $request->user()->opd_id) {
            return response()->json([
                'message' => 'You are not allowed to view this RFC',
            ], 403);
        }

        $rfc->load([
            'requester',
            'requesterOpd',
            'attachments',
            'approvals.approver',
            'currentApproval',
        ]);

        $user            = $request->user();
        $currentApproval = $rfc->currentApproval;

        // Hitung allowed actions berdasarkan approver yang sedang pending
        $allowedActions = [];
        if ($currentApproval && $user && $currentApproval->approver_id === $user->id) {
            $allowedActions = ['need_info', 'approve', 'reject', 'forward'];
        }

        return response()->json([
            'data' => [
                'id'          => $rfc->id,
                'ticket_code' => $rfc->ticket_code,
                'status'      => $rfc->status,
                'category'    => $rfc->category,

                // Header: Info pemohon
                'requester' => [
                    'name'     => $rfc->requester?->name,
                    'position' => $rfc->requester?->role,
                    'opd_name' => $rfc->requesterOpd?->name,
                ],

                // Detail RFC: untuk isi card di UI mobile
                'rfc_detail' => [
                    'title'           => $rfc->title,
                    'affected_asset'  => null, // nanti bisa diisi dari relasi CI
                    'description'     => $rfc->description,
                    'technician_note' => $rfc->tech_note,
                    'priority_label'  => $rfc->priority_label, // Low / Medium / High
                    'priority_code'   => $rfc->priority,       // low / medium / high
                ],

                // File bukti
                'attachments' => $rfc->attachments->map(function ($a) {
                    return [
                        'id'        => $a->id,
                        'file_name' => $a->file_name,
                        'url'       => $a->url,
                        'mime_type' => $a->mime_type,
                    ];
                })->values(),

                // Informasi approval berjenjang
                'approval' => [
                    'current_level'    => $currentApproval?->level,
                    'current_decision' => $currentApproval?->decision,
                    'your_role'        => $user?->role,
                    'allowed_actions'  => $allowedActions,
                    'history'          => $rfc->approvals->map(function ($appr) {
                        return [
                            'level'      => $appr->level,
                            'decision'   => $appr->decision,
                            'status'     => $appr->isPending() ? 'pending' : 'done',
                            'by'         => $appr->approver?->name,
                            'note'       => $appr->reason,
                            'decided_at' => optional($appr->decided_at)->toDateTimeString(),
                        ];
                    })->values(),
                ],
            ],
        ]);
    }

    /**
     * POST /api/v1/rfc
     *
     * NOTE:
     * - Kalau body mengandung "ticket_code" → dianggap request dari aplikasi SERVICE DESK.
     * - Kalau body mengandung "ci_ids" → dianggap request dari user OPD (flow lama + auto assessment).
     *
     * @OA\Post(
     *   path="/api/v1/rfc",
     *   tags={"RFC"},
     *   summary="Buat RFC baru (Service Desk / OPD)",
     *   security={{"bearerAuth":{}}},
     *   @OA\RequestBody(
     *     required=true,
     *     description="Untuk integrasi Service Desk gunakan: ticket_code, title, description, priority, attachments, technician_note",
     *   ),
     *   @OA\Response(response=201, description="RFC berhasil dibuat"),
     *   @OA\Response(response=422, description="Validasi gagal")
     * )
     */
    public function store(Request $request)
    {
        // 1️⃣ Mode integrasi dari Service Desk (punya ticket_code)
        if ($request->has('ticket_code')) {
            $validated = $request->validate([
                'ticket_code'     => 'required|string',
                'title'           => 'required|string',
                'description'     => 'required|string',
                'priority'        => 'required|in:low,medium,high',
                'attachments'     => 'array',
                'attachments.*'   => 'string',
                'technician_note' => 'nullable|string',
            ]);

            $user = $request->user(); // bisa service-account / null

            $rfc = Rfc::create([
                'ticket_code'      => $validated['ticket_code'],
                'title'            => $validated['title'],
                'description'      => $validated['description'],
                'category'         => 'normal',
                'urgency'          => $validated['priority'],
                'priority'         => $validated['priority'],  // low/medium/high langsung
                'status'           => 'submitted',
                'requester_id'     => $user->id ?? null,
                'requester_opd_id' => $user->opd_id ?? null,
                'tech_note'        => $validated['technician_note'] ?? null,
            ]);

            if (!empty($validated['attachments'])) {
                foreach ($validated['attachments'] as $url) {
                    RfcAttachment::create([
                        'rfc_id' => $rfc->id,
                        'url'    => $url,
                    ]);
                }
            }

            return response()->json([
                'message' => 'RFC successfully created from Service Desk',
                'data'    => $rfc->load('attachments'),
            ], 201);
        }

        // 2️⃣ Mode lama: user OPD buat RFC langsung dari modul Change
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'category'    => 'required|in:normal,standard,emergency',
            'urgency'     => 'required|in:low,medium,high,critical',
            'priority'    => 'required|in:low,medium,high',
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
                'priority'         => $data['priority'], // low/medium/high
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
                'risk_auto_score'       => $maxRisk,
                'notes'                 => $notes,
            ]);

            // 5️⃣ Load relasi untuk response
            $rfc->load(['configurationItems', 'assessment']);

            return response()->json($rfc, 201);
        });
    }
}
