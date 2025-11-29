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
        $userDinasId = $request->user()->dinas_id ?? $request->user()->opd_id;
        if ($userDinasId) {
            $query->where('requester_opd_id', $userDinasId);
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
        $userDinasId = $request->user()->dinas_id ?? $request->user()->opd_id;
        if ($userDinasId && $rfc->requester_opd_id !== $userDinasId) {
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
                    'position' => $rfc->requester?->roleObj?->slug ?? $rfc->requester?->role,
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
                    'your_role'        => $user?->roleObj?->slug ?? $user?->role,
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
     * - Kalau body mengandung "rfc_id" → dianggap request dari aplikasi SERVICE DESK.
     * - Kalau body mengandung "ci_ids" → dianggap request dari user OPD (flow lama + auto assessment).
     *
     * @OA\Post(
     *   path="/api/v1/rfc",
     *   tags={"RFC"},
     *   summary="Buat RFC baru (Service Desk / OPD)",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       oneOf={
     *         @OA\Schema(
     *           title="Request dari Service Desk",
     *           required={"rfc_id","title","description","priority","request_at","asset_id"},
     *           @OA\Property(
     *             property="rfc_id",
     *             type="string",
     *             example="RFC-2025-0001",
     *             description="ID RFC dari aplikasi Service Desk"
     *           ),
     *           @OA\Property(
     *             property="title",
     *             type="string",
     *             example="Pembaruan Aplikasi E-Kinerja Versi 2.1"
     *           ),
     *           @OA\Property(
     *             property="description",
     *             type="string",
     *             example="Diperlukan pembaruan modul pelaporan kinerja agar sesuai pedoman terbaru BKN."
     *           ),
     *           @OA\Property(
     *             property="priority",
     *             type="string",
     *             enum={"low","medium","high"},
     *             example="low",
     *             description="Prioritas dari Service Desk"
     *           ),
     *           @OA\Property(
     *             property="attachments",
     *             type="array",
     *             @OA\Items(
     *               type="string",
     *               example="https://api-sindra.co.id/storage/rfc/1.pdf"
     *             ),
     *             description="Daftar URL lampiran dari Service Desk"
     *           ),
     *           @OA\Property(
     *             property="request_at",
     *             type="string",
     *             format="date-time",
     *             example="2025-11-20T10:45:00+07:00",
     *             description="Waktu request dibuat di aplikasi Service Desk"
     *           ),
     *           @OA\Property(
     *             property="asset_id",
     *             type="integer",
     *             example=123,
     *             description="ID aset terdampak dari aplikasi Service Desk"
     *           )
        *           @OA\Property(
        *             property="sso_id",
        *             type="string",
        *             example="sds-12345",
        *             description="SSO ID user pengirim dari Service Desk (opsional jika email tersedia)"
        *           )
        *           @OA\Property(
        *             property="email",
        *             type="string",
        *             format="email",
        *             example="user@example.com",
        *             description="Email user pengirim dari Service Desk (opsional jika sso_id tersedia)"
        *           )
     *         ),
     *         @OA\Schema(
     *           title="Request dari user OPD (modul Change)",
     *           required={"title","category","urgency","priority","ci_ids"},
     *           @OA\Property(
     *             property="title",
     *             type="string",
     *             example="Upgrade Database SIM Pegawai"
     *           ),
     *           @OA\Property(
     *             property="description",
     *             type="string",
     *             example="Perlu upgrade ke versi 13 untuk compliance."
     *           ),
     *           @OA\Property(
     *             property="category",
     *             type="string",
     *             enum={"normal","standard","emergency"},
     *             example="normal"
     *           ),
     *           @OA\Property(
     *             property="urgency",
     *             type="string",
     *             enum={"low","medium","high","critical"},
     *             example="high"
     *           ),
     *           @OA\Property(
     *             property="priority",
     *             type="string",
     *             enum={"low","medium","high"},
     *             example="medium"
     *           ),
     *           @OA\Property(
     *             property="ci_ids",
     *             type="array",
     *             description="Daftar ID Configuration Item yang terdampak",
     *             @OA\Items(type="integer", example=101)
     *           )
     *         )
     *       }
     *     )
     *   ),
     *   @OA\Response(
     *     response=201,
     *     description="RFC berhasil dibuat",
     *     @OA\JsonContent(
     *       oneOf={
     *         @OA\Schema(
     *           title="Response dari Service Desk",
     *           @OA\Property(property="message", type="string", example="RFC successfully created from Service Desk"),
     *           @OA\Property(
     *             property="data",
     *             type="object",
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="ticket_code", type="string", example="RFC-2025-0001"),
     *             @OA\Property(property="title", type="string", example="Pembaruan Aplikasi E-Kinerja Versi 2.1"),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="category", type="string", example="normal"),
     *             @OA\Property(property="urgency", type="string", example="low"),
     *             @OA\Property(property="priority", type="string", example="low"),
     *             @OA\Property(property="status", type="string", example="submitted")
     *           )
     *         ),
     *         @OA\Schema(
     *           title="Response dari user OPD",
     *           @OA\Property(property="id", type="integer", example=2),
     *           @OA\Property(property="title", type="string", example="Upgrade Database SIM Pegawai"),
     *           @OA\Property(property="description", type="string"),
     *           @OA\Property(property="category", type="string", example="normal"),
     *           @OA\Property(property="urgency", type="string", example="high"),
     *           @OA\Property(property="priority", type="string", example="medium"),
     *           @OA\Property(property="status", type="string", example="submitted")
     *         )
     *       }
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
        // 1️⃣ Mode integrasi dari Service Desk (punya rfc_id)
        if ($request->has('rfc_id')) {
            $validated = $request->validate([
                'rfc_id'        => 'required|string',
                'title'         => 'required|string',
                'description'   => 'required|string',
                'priority'      => 'required|in:low,medium,high',
                'attachments'   => 'array',
                'attachments.*' => 'string',
                'request_at'    => 'required|date',
                'asset_id'      => 'required|integer',
                // Optional mapping fields from Service Desk
                'sso_id'        => 'nullable|string',
                'email'         => 'nullable|email',
            ]);


        // If request includes an sso_id or email for requester, map to internal user id
        $requesterInternalId = null;
        $ssoId = $request->input('sso_id');
        $email = $request->input('email');
        if (!empty($ssoId) || !empty($email)) {
            $requester = null;
            if (!empty($ssoId)) {
                $requester = \App\Models\User::where('sso_id', $ssoId)->first();
            }
            if (! $requester && !empty($email)) {
                $requester = \App\Models\User::where('email', $email)->first();
            }
            if ($requester) {
                $requesterInternalId = $requester->id;
            } else {
                // Mapping failed. See if we should fallback to a service-desk user.
                $fallbackEmail = env('SERVICE_DESK_FALLBACK_EMAIL', null);
                if ($fallbackEmail) {
                    // Find or create a fallback service desk user
                    $firstDinas = \App\Models\Dinas::first();
                    // Ensure fallback user has OPD (dinas_id) set so FK constraint is satisfied.
                    $fallbackUser = \App\Models\User::updateOrCreate(
                        ['email' => $fallbackEmail],
                        [
                            'name' => 'Service Desk',
                            'password' => bcrypt(\Illuminate\Support\Str::random(24)),
                            'sso_id' => 'service-desk',
                            'role_id' => null, // optional, seeder can set a role
                            'dinas_id' => $firstDinas?->id ?? null,
                        ]
                    );
                        // Ensure a dinas_id exists in case the user existed with null before.
                        if (empty($fallbackUser->dinas_id) && $firstDinas) {
                            $fallbackUser->dinas_id = $firstDinas->id;
                            $fallbackUser->save();
                        }
                        $requesterInternalId = $fallbackUser->id;
                } else {
                    // Return validation error: mapping failed
                    return response()->json([
                        'status' => false,
                        'message' => 'Requester not found: please include sso_id or email that maps to an existing user',
                    ], 422);
                }
            }
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Please include sso_id or email to identify requester',
            ], 422);
        }

        $rfc = Rfc::create([
        'ticket_code'      => $validated['rfc_id'],
        'title'            => $validated['title'],
        'description'      => $validated['description'],
        'category'         => 'normal',
        'urgency'          => $validated['priority'],
        'priority'         => $validated['priority'],
        'status'           => 'submitted',
        'requester_id'     => $requesterInternalId,
        'requester_opd_id' => optional(\App\Models\User::find($requesterInternalId))->dinas_id ?? null,
        'tech_note'        => null,
        'request_at'       => $validated['request_at'],
        'asset_id'         => $validated['asset_id'],
    ]);   // ✅ cukup begini


            if (!empty($validated['attachments'])) {
                foreach ($validated['attachments'] as $url) {
                    RfcAttachment::create([
                        'rfc_id' => $rfc->id,
                        'url'    => $url,
                    ]);
                }
            }

            return response()->json([
                'status'=> true,
                'message' => 'RFC successfully created from Service Desk',
                'data'    => $rfc->load('attachments'),
            ], 201);
        }
    }
}