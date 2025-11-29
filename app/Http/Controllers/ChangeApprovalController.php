<?php

namespace App\Http\Controllers;

use App\Models\Rfc;
use App\Models\RfcApproval;
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
     *         example="kabid",
     *         enum={"kasi","kabid","kadis","diskominfo"}
     *       ),
     *       @OA\Property(
     *         property="decision",
     *         type="string",
     *         description="Keputusan approval",
     *         example="approve",
     *         enum={"approve","reject","need_info"}
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
     *         @OA\Property(property="level", type="string", example="kabid"),
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
            'stage'    => 'required|string|in:kasi,kabid,kadis,diskominfo',
            'decision' => 'required|string|in:approve,reject,need_info',
            'note'     => 'nullable|string',
        ]);

        // map "diskominfo" ke "kadis" (sesuai enum di migration)
        $level = $data['stage'] === 'diskominfo' ? 'kadis' : $data['stage'];

        $approval = RfcApproval::firstOrNew([
            'rfc_id' => $change->id,
            'level'  => $level,
        ]);

        $approval->approver_id = $request->user()->id;
        $approval->decision    = $data['decision'] === 'need_info' ? 'revise' : $data['decision'];
        $approval->reason      = $data['note'] ?? null;
        $approval->decided_at  = Carbon::now();
        $approval->save();

        // 🔔 1) Notifikasi ke aplikasi Service Desk (teknisi)
        $this->notifyServiceDeskTechnician($change, $approval);

        // 🔔 2) Notifikasi ke pemohon RFC (user OPD)
        $this->notifyRequester($change, $approval);

        return response()->json([
            'message'  => 'Decision recorded',
            'approval' => $approval,
        ]);
    }

    /**
     * POST /api/v1/changes/{change}/approve
     */
    public function approve(Request $request, Rfc $change)
    {
        $request->merge([
            'decision' => 'approve',
        ]);

        return $this->decide($request, $change);
    }

    /**
     * POST /api/v1/changes/{change}/reject
     */
    public function reject(Request $request, Rfc $change)
    {
        $request->merge([
            'decision' => 'reject',
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
        // Kalau RFC ini bukan hasil integrasi Service Desk (tidak punya ticket_code),
        // kamu bisa skip.
        if (!$rfc->ticket_code) {
            return;
        }

        try {
            Http::withToken(config('services.servicedesk.token'))
                ->post(
                    rtrim(config('services.servicedesk.base_url'), '/') . '/internal/rfc/approval-callback',
                    [
                        'rfc_id'        => $rfc->ticket_code,  // ID di sistem Service Desk
                        'status'        => $rfc->status,
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
     * 🔔 Notifikasi ke pemohon RFC (user OPD)
     *
     * Implementasi bebas:
     * - bisa tulis ke tabel notifications sendiri
     * - atau kirim email / push, dsb.
     */
    protected function notifyRequester(Rfc $rfc, RfcApproval $approval): void
    {
        if (!$rfc->requester) {
            return;
        }

        // Contoh sangat sederhana: pakai log dulu
        logger()->info('Notify requester about RFC approval decision', [
            'requester_id' => $rfc->requester_id,
            'rfc_id'       => $rfc->id,
            'decision'     => $approval->decision,
            'level'        => $approval->level,
        ]);

        // Nanti bisa kamu ganti dengan:
        // - model Notification
        // - event + listener
        // - email, dsb.
    }
}
