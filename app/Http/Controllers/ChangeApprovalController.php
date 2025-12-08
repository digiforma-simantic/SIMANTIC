<?php

namespace App\Http\Controllers;

use App\Models\Rfc;
use App\Models\RfcApproval;
use App\Services\ServiceDeskCallbackService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;

/**
 * @OA\Tag(
 *     name="Change Approval",
 *     description="Proses persetujuan (approval) untuk Request for Change (RFC) / Change Request"
 * )
 */
class ChangeApprovalController extends Controller
{
    /**
     * POST /api/v1/changes/{change}/decisions
     *
     * @OA\Post(
     *   path="/api/v1/changes/{change}/decisions",
     *   tags={"Change Approval"},
     *   summary="Memberikan keputusan approval untuk Change Request",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(
     *     name="change",
     *     in="path",
     *     required=true,
     *     description="ID RFC / Change Request yang ingin di-approve",
     *     @OA\Schema(type="integer", example=101)
     *   ),
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"stage","decision"},
     *       @OA\Property(
    *         property="stage",
    *         type="string",
    *         description="Level approval yang sedang memutuskan",
    *         example="kepala_bidang",
    *         enum={"kepala_seksi","kepala_bidang","kepala_dinas","admin_dinas"}
     *       ),
     *       @OA\Property(
     *         property="decision",
     *         type="string",
     *         description="Keputusan approval",
     *         example="approved",
     *         enum={"approved","rejected","need_info"}
     *       ),
     *       @OA\Property(
     *         property="note",
     *         type="string",
     *         description="Catatan tambahan (opsional)",
     *         example="Setuju, pastikan backup full sebelum patch."
     *       )
     *     )
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Keputusan approval berhasil direkam",
     *     @OA\JsonContent(
     *       @OA\Property(property="message", type="string", example="Decision recorded"),
     *       @OA\Property(
     *         property="approval",
     *         type="object",
     *         @OA\Property(property="id", type="integer", example=5),
     *         @OA\Property(property="rfc_id", type="integer", example=101),
    *         @OA\Property(property="level", type="string", example="kepala_bidang"),
     *         @OA\Property(property="decision", type="string", example="approve"),
     *         @OA\Property(property="reason", type="string", example="Setuju, risiko sudah diterima."),
     *         @OA\Property(property="decided_at", type="string", example="2025-11-15 10:30:00")
     *       )
     *     )
     *   ),
     *   @OA\Response(response=422, description="Validasi gagal"),
     *   @OA\Response(response=404, description="RFC / Change Request tidak ditemukan")
     * )
     */
    public function decide(Request $request, Rfc $change)
    {
        $data = $request->validate([
            'stage'    => 'required|string|in:kepala_seksi,kepala_bidang,kepala_dinas,admin_dinas',
            'decision' => 'required|string|in:approved,rejected,need_info',
            'note'     => 'nullable|string',
        ]);

        $level = $data['stage'];

        $approval = RfcApproval::firstOrNew([
            'rfc_id' => $change->id,
            'level'  => $level,
        ]);

        $approval->approver_id = $request->user()?->id;
        // Map decision for database storage
        $approval->decision = $data['decision'] === 'need_info' ? 'revise' : $data['decision'];
        $approval->reason      = $data['note'] ?? null;
        $approval->decided_at  = Carbon::now();
        $approval->save();

        // Map decision to RFC status
        $rfcStatus = $this->mapDecisionToStatus($approval->decision);
        
        // Update RFC status
        $change->status = $rfcStatus;
        $change->save();

        // 🔔 Send callback to Service Desk
        $callbackService = app(ServiceDeskCallbackService::class);
        $callbackSent = $callbackService->sendStatus($change, $rfcStatus, $data['note'] ?? null);

        // 🔔 1) Notifikasi ke aplikasi Service Desk (teknisi) - Legacy
        // $this->notifyServiceDeskTechnician($change, $approval);

        // 🔔 2) Notifikasi ke pemohon RFC (user OPD)
        $this->notifyRequester($change, $approval);

        return response()->json([
            'status'   => true,
            'message'  => 'RFC status updated successfully',
            'data'     => [
                'rfc_id'         => $change->id,
                'rfc_status'     => $change->status,
                'approval'       => $approval,
                'callback_sent'  => $callbackSent,
            ],
        ]);
    }

    /**
     * Map approval decision to RFC status
     *
     * @param string $decision
     * @return string
     */
    protected function mapDecisionToStatus(string $decision): string
    {
        return match($decision) {
            'approved' => 'approved',
            'rejected' => 'rejected',
            'revise' => 'pending',
            default => 'approved',
        };
    }

    /**
     * POST /api/v1/changes/{change}/approve
     */
    public function approve(Request $request, Rfc $change)
    {
        $request->merge([
            'decision' => 'approved',
        ]);

        return $this->decide($request, $change);
    }

    /**
     * POST /api/v1/changes/{change}/reject
     */
    public function reject(Request $request, Rfc $change)
    {
        $request->merge([
            'decision' => 'rejected',
        ]);

        return $this->decide($request, $change);
    }

    /**
     * 🔔 Notifikasi ke aplikasi Service Desk (teknisi)
     * Dipanggil setiap ada keputusan approval baru.
     *
     * Di sini kamu panggil API internal-nya tim Service Desk,
     * misalnya: POST /internal/rfc/approval-callback
     */
    protected function notifyServiceDeskTechnician(Rfc $rfc, RfcApproval $approval): void
    {
      
        // Kalau RFC ini bukan hasil integrasi Service Desk (tidak punya rfc_service_id),
        // kamu bisa skip.
        if (!$rfc->rfc_service_id) {
            return;
        }

        try {
            Http::withToken(config('services.servicedesk.token'))
                ->post(
                    rtrim(config('services.servicedesk.base_url'), '/') . '/internal/rfc/approval-callback',
                    [
                        'rfc_id'        => $rfc->rfc_service_id,  // ID di sistem Service Desk
                        'decision'      => $approval->decision,
                        'level'         => $approval->level,
                        'note'          => $approval->reason,
                        'decided_at'    => $approval->decided_at?->toISOString(),
                    ]
                );
        } catch (\Throwable $e) {
            // Jangan bikin approval gagal hanya karena notif gagal.
            logger()->warning('Failed sending approval callback to Service Desk', [
                'rfc_id' => $rfc->id,
                'error'  => $e->getMessage(),
            ]);
        }
    }

    /**
     * 🔔 Notifikasi ke pemohon RFC (Service Desk integration)
     *
     * Note: RFC is now created by Service Desk, so notification should be
     * sent back to Service Desk rather than internal users.
     * This method is kept for future extension.
     */
    protected function notifyRequester(Rfc $rfc, RfcApproval $approval): void
    {
        // Log the approval decision
        logger()->info('RFC approval decision recorded', [
            'rfc_id'       => $rfc->id,
            'rfc_service_id' => $rfc->rfc_service_id,
            'decision'     => $approval->decision,
            'level'        => $approval->level,
        ]);

        // Future: Implement internal notification system
        // - model Notification
        // - event + listener
        // - email, dsb.
    }
}
