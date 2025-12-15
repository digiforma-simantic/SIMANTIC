<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rfc;
use App\Models\RfcApproval;
use App\Models\RiskRegister;
use App\Models\RfcAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

// ...existing code...
class RfcController extends Controller
{
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
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'RFC not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

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

    public function update(Request $request, $id)
    {
        $rfcApproval = RfcApproval::findOrFail($id);

        $validated = $request->validate([
            'decision'     => 'sometimes|in:approved,rejected,revise',
            'reason'       => 'nullable|string',
        ]);

        if($request->reason){
            $validated['reason'] = $request->reason;
            $validated['decision'] = 'revise';
        }

        $rfcApproval->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'RFC successfully updated',
            'data' => $rfcApproval,
        ]);
    }

    // ...existing code...
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

    // ...existing code...
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

    // ...existing code...
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