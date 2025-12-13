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
        $user = $request->user();
        
        // Filter RFC berdasarkan sso_id user yang login (untuk staff)
        // $query = Rfc::where('sso_id', $user->sso_id)
        //     ->orderBy('created_at', 'desc');

        $query = Rfc::query()->orderBy('created_at', 'desc');

        if ($request->sso_id) {
            $query->where('sso_id', $request->sso_id);
        }

        // Optional filter status
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($priority = $request->query('priority')) {
            $query->where('priority', $priority);
        }

        $perPage = (int) $request->query('per_page', 100);

        $result = $query->paginate($perPage);

        return response()->json([
            'status' => true,
            'data' => $result->items(),
            'meta' => [
                'current_page' => $result->currentPage(),
                'last_page' => $result->lastPage(),
                'per_page' => $result->perPage(),
                'total' => $result->total(),
            ]
        ]);
    }

    /**
     * GET /api/v1/rfc/{rfc}
    * Detail RFC untuk layar approval (Kepala Seksi/Kepala Bidang/Kepala Dinas).
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
    public function show(Request $request, $id)
    {
        // return "haha";
        try {
            $rfc = Rfc::with(['approvals.approver.roleObj'])
                ->findOrFail($id);

            return response()->json([
                'status' => true,
                'data' => [
                    'id' => $rfc->id,
                    'title' => $rfc->title,
                    'description' => $rfc->description,
                    'priority' => $rfc->priority,
                    'status' => $rfc->status,
                    'ci_code' => $rfc->ci_code,
                    'attachment_path' => $rfc->attachment_path,
                    'created_at' => $rfc->created_at,
                    'sso_id' => $rfc->sso_id,
                    'approvals' => $rfc->approvals->map(function ($approval) {
                        return [
                            'level' => $approval->level,
                            'decision' => $approval->decision,
                            'reason' => $approval->reason,
                            'approved_at' => $approval->approved_at,
                            'approver' => [
                                'name' => $approval->approver->name ?? 'Unknown',
                                'role_name' => $approval->approver->roleObj->name ?? 'Unknown',
                            ],
                        ];
                    }),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'RFC not found',
                'error' => $e->getMessage()
            ], 404);
        }
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
     *         property="ci_code",
     *         type="string",
     *         example="CI-2025-001",
     *         description="Configuration Item code untuk callback (nullable)"
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
     *         @OA\Property(property="ci_code", type="string", example="CI-2025-001"),
     *         @OA\Property(property="title", type="string", example="Upgrade Server Production"),
     *         @OA\Property(property="description", type="string", example="Perlu upgrade RAM"),
     *         @OA\Property(property="priority", type="string", example="high"),
     *         @OA\Property(property="status", type="string", example="pending"),
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
            'ci_code'            => 'nullable|string|max:255',
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
            'ci_code'        => $validated['ci_code'] ?? null,
            'title'          => $validated['title'],
            'description'    => $validated['description'] ?? null,
            'priority'       => $validated['priority'],
            'status'         => 'pending',
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
                'ci_code'         => $rfc->ci_code,
                'title'           => $rfc->title,
                'description'     => $rfc->description,
                'priority'        => $rfc->priority,
                'status'          => $rfc->status,
                'attachments'     => $rfc->attachments,
                'requested_at'    => optional($rfc->requested_at)->toDateTimeString(),
                'asset_uuid'      => $rfc->asset_uuid,
                'sso_id'          => $rfc->sso_id,
                'created_at'      => $rfc->created_at->toDateTimeString(),
                'updated_at'      => $rfc->updated_at->toDateTimeString(),
            ],
        ], 201);
    }

    /**
     * GET /api/v1/rfc/pending-approval
     * Get pending RFCs for approval based on user role
     * 
     * @OA\Get(
     *     path="/api/v1/rfc/pending-approval",
     *     tags={"RFC"},
     *     summary="Get pending RFCs for current user to approve",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Success")
     * )
     */
    public function getPendingApprovals(Request $request)
    {
        $user = $request->user();
        $role = $user->roleObj->slug ?? $user->role;

        $query = Rfc::with(['requester', 'requester.dinas', 'approvals']);

        // Filter berdasarkan role dan status approval
        switch ($role) {
            case 'kepala_seksi':
                // Kepala Seksi approve RFC dari staff di OPD yang sama
                $query->where('status', 'pending')
                    ->whereHas('requester', function ($q) use ($user) {
                        $q->where('dinas_id', $user->dinas_id)
                          ->whereHas('roleObj', function ($roleQuery) {
                              $roleQuery->where('slug', 'staff');
                          });
                    })
                    ->whereDoesntHave('approvals', function ($q) {
                        $q->where('level', 'kepala_seksi');
                    });
                break;

            case 'kepala_bidang':
                // Kepala Bidang approve RFC yang sudah di-approve Kepala Seksi
                $query->where('status', 'pending')
                    ->whereHas('requester', function ($q) use ($user) {
                        $q->where('dinas_id', $user->dinas_id);
                    })
                    ->whereHas('approvals', function ($q) {
                        $q->where('level', 'kepala_seksi')->where('decision', 'approved');
                    })
                    ->whereDoesntHave('approvals', function ($q) {
                        $q->where('level', 'kepala_bidang');
                    });
                break;

            case 'kepala_dinas':
                // Kepala Dinas approve RFC yang sudah di-approve Kepala Bidang
                $query->where('status', 'pending')
                    ->whereHas('requester', function ($q) use ($user) {
                        $q->where('dinas_id', $user->dinas_id);
                    })
                    ->whereHas('approvals', function ($q) {
                        $q->where('level', 'kepala_bidang')->where('decision', 'approved');
                    })
                    ->whereDoesntHave('approvals', function ($q) {
                        $q->where('level', 'kepala_dinas');
                    });
                break;

            case 'admin_dinas':
                // Admin Dinas (final approver) - approve RFC yang sudah di-approve Kepala Dinas
                $query->where('status', 'pending')
                    ->whereHas('approvals', function ($q) {
                        $q->where('level', 'kepala_dinas')->where('decision', 'approved');
                    })
                    ->whereDoesntHave('approvals', function ($q) {
                        $q->where('level', 'admin_dinas');
                    });
                break;

            case 'admin_kota':
                // Admin Kota tidak approve, hanya monitor
                return response()->json([
                    'status' => true,
                    'data' => [],
                    'message' => 'Admin Kota can only monitor, not approve'
                ]);

            default:
                // Role lain tidak bisa approve
                return response()->json([
                    'status' => true,
                    'data' => [],
                    'message' => 'No approval permission for this role'
                ]);
        }

        $rfcs = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => true,
            'data' => $rfcs->map(function ($rfc) {
                return [
                    'id' => $rfc->id,
                    'title' => $rfc->title,
                    'description' => $rfc->description,
                    'priority' => $rfc->priority,
                    'status' => $rfc->status,
                    'created_at' => $rfc->created_at->format('d F Y'),
                    'requester' => [
                        'id' => $rfc->requester->id ?? null,
                        'name' => $rfc->requester->name ?? 'Unknown',
                        'email' => $rfc->requester->email ?? null,
                        'dinas' => $rfc->requester->dinas->name ?? 'Unknown',
                        'role' => $rfc->requester->roleObj->name ?? 'Unknown',
                    ],
                    'approvals_count' => $rfc->approvals->count(),
                ];
            })
        ]);
    }

    /**
     * POST /api/v1/rfc/{id}/approve
     * Approve or reject RFC
     * 
     * @OA\Post(
     *     path="/api/v1/rfc/{id}/approve",
     *     tags={"RFC"},
     *     summary="Approve or reject RFC",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="decision", type="string", enum={"approved", "rejected"}),
     *             @OA\Property(property="reason", type="string", nullable=true)
     *         )
     *     ),
     *     @OA\Response(response=200, description="Success")
     * )
     */
    public function approve(Request $request, $id)
    {
        $request->validate([
            'decision' => 'required|in:approved,rejected',
            'reason' => 'nullable|string',
        ]);

        $user = $request->user();
        $role = $user->roleObj->slug ?? $user->role;

        // Mapping role ke approval level
        $levelMap = [
            'kepala_seksi' => 'kepala_seksi',
            'kepala_bidang' => 'kepala_bidang',
            'kepala_dinas' => 'kepala_dinas',
            'admin_dinas' => 'admin_dinas',
        ];

        $level = $levelMap[$role] ?? null;

        if (!$level) {
            return response()->json([
                'status' => false,
                'message' => 'You do not have permission to approve RFC'
            ], 403);
        }

        DB::beginTransaction();
        try {
            $rfc = Rfc::findOrFail($id);

            // Cek apakah sudah pernah approve di level ini
            $existingApproval = \App\Models\RfcApproval::where('rfc_id', $id)
                ->where('level', $level)
                ->first();

            if ($existingApproval) {
                return response()->json([
                    'status' => false,
                    'message' => 'RFC already processed at this level'
                ], 400);
            }

            // Simpan approval
            \App\Models\RfcApproval::create([
                'rfc_id' => $id,
                'approver_id' => $user->id,
                'level' => $level,
                'decision' => $request->decision,
                'reason' => $request->reason,
                'approved_at' => now(),
            ]);

            // Jika rejected, update status RFC
            if ($request->decision === 'rejected') {
                $rfc->update(['status' => 'rejected']);
            } else {
                // Jika approved di level admin_dinas (level terakhir), ubah status jadi approved
                if ($level === 'admin_dinas') {
                    $rfc->update(['status' => 'approved']);
                }
            }

            DB::commit();

            $nextLevel = $this->getNextLevel($level);

            return response()->json([
                'status' => true,
                'message' => 'RFC ' . $request->decision . ' successfully',
                'data' => [
                    'rfc_id' => $rfc->id,
                    'status' => $rfc->status,
                    'next_level' => $nextLevel,
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => 'Failed to process approval: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/v1/rfc/history
     * Get RFC approval history for current user
     * 
     * @OA\Get(
     *     path="/api/v1/rfc/history",
     *     tags={"RFC"},
     *     summary="Get RFC approval history for current user",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Success")
     * )
     */
    public function getHistory(Request $request)
    {
        $user = $request->user();

        // Get RFCs yang sudah pernah di-approve/reject oleh user ini
        $rfcs = Rfc::with(['requester', 'requester.dinas', 'approvals'])
            ->whereHas('approvals', function ($q) use ($user) {
                $q->where('approver_id', $user->id);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $rfcs->map(function ($rfc) use ($user) {
                $myApproval = $rfc->approvals->firstWhere('approver_id', $user->id);
                
                return [
                    'id' => $rfc->id,
                    'title' => $rfc->title,
                    'priority' => $rfc->priority,
                    'status' => $rfc->status,
                    'created_at' => $rfc->created_at->format('d F Y'),
                    'requester' => [
                        'name' => $rfc->requester->name ?? 'Unknown',
                        'dinas' => $rfc->requester->dinas->name ?? 'Unknown',
                    ],
                    'my_decision' => $myApproval->decision ?? null,
                    'my_decision_at' => $myApproval->approved_at ? $myApproval->approved_at->format('d F Y H:i') : null,
                ];
            })
        ]);
    }

    /**
     * Helper: Get next approval level
     */
    private function getNextLevel($currentLevel)
    {
        $flow = [
            'kepala_seksi' => 'kepala_bidang',
            'kepala_bidang' => 'kepala_dinas',
            'kepala_dinas' => 'admin_dinas',
            'admin_dinas' => 'completed',
        ];
        return $flow[$currentLevel] ?? null;
    }
}