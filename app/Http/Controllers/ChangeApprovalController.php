<?php

namespace App\Http\Controllers;

use App\Models\Rfc;
use App\Models\RfcApproval;
use App\Services\ServiceDeskCallbackService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;

// ...existing code...
class ChangeApprovalController extends Controller
{
    // ...existing code...
    public function decide(Request $request, Rfc $change)
    {
        $data = $request->validate([
            'stage'    => 'required|string|in:kepala_seksi,kepala_bidang,kepala_dinas,admin_dinas',
            'decision' => 'required|string|in:approved,rejected,need_info',
            'note'     => 'nullable|string',
        ]);

        // ...existing logic for decide (if any, add here)
        // Placeholder: return response for now
        return response()->json(['message' => 'Decision processed', 'data' => $data]);
    }

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
                        'approved_at'    => $approval->approved_at?->toISOString(),
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
