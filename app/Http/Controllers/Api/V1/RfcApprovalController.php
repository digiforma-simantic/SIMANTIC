<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Rfc;
use App\Models\RfcApproval;
use Illuminate\Http\Request;

class RfcApprovalController extends Controller
{
    /**
     * Helper: ambil approval yang lagi pending untuk user ini
     */
    protected function getPendingApprovalForUser(Rfc $rfc, $user)
    {
        return $rfc->approvals()
            ->where('approver_id', $user->id)
            ->where('status', 'pending')
            ->latest()
            ->first();
    }

    /**
     * POST /api/v1/rfc/{rfc}/approve
     */
    public function approve(Rfc $rfc, Request $request)
    {
        $request->validate([
            'note' => 'nullable|string',
        ]);

        $user = $request->user();
        $approval = $this->getPendingApprovalForUser($rfc, $user);

        if (!$approval) {
            return response()->json([
                'message' => 'Tidak ada approval pending untuk user ini'
            ], 403);
        }

        $approval->update([
            'status'     => 'done',
            'decision'   => 'approve',
            'reason'     => $request->note,
            'approved_at' => now(),
        ]);

        // Tentukan next level
        $nextLevel = $this->getNextLevel($approval->level);

        if ($nextLevel) {
            // Buat approval berikutnya (misal dari Kepala Seksi -> Kepala Bidang)
            RfcApproval::create([
                'rfc_id'      => $rfc->id,
                'approver_id' => $this->getApproverIdByLevel($rfc, $nextLevel),
                'level'       => $nextLevel,
                'status'      => 'pending',
            ]);

            $rfc->update([
                'status' => 'approval_pending',
            ]);
        }

        return response()->json([
            'message' => 'RFC berhasil disetujui',
        ]);
    }

    /**
     * POST /api/v1/rfc/{rfc}/reject
     */
    public function reject(Rfc $rfc, Request $request)
    {
        $request->validate([
            'note' => 'nullable|string',
        ]);

        $user = $request->user();
        $approval = $this->getPendingApprovalForUser($rfc, $user);

        if (!$approval) {
            return response()->json([
                'message' => 'Tidak ada approval pending untuk user ini'
            ], 403);
        }

        $approval->update([
            'status'     => 'done',
            'decision'   => 'reject',
            'reason'     => $request->note,
            'approved_at' => now(),
        ]);

        // Kalau di-reject, RFC jadi failed
        $rfc->update([
            'status' => 'failed',
        ]);

        return response()->json([
            'message' => 'RFC berhasil ditolak',
        ]);
    }

    /**
     * POST /api/v1/rfc/{rfc}/need-info
     */
    public function needInfo(Rfc $rfc, Request $request)
    {
        $request->validate([
            'note' => 'required|string',
        ]);

        $user = $request->user();
        $approval = $this->getPendingApprovalForUser($rfc, $user);

        if (!$approval) {
            return response()->json([
                'message' => 'Tidak ada approval pending untuk user ini'
            ], 403);
        }

        $approval->update([
            'status'     => 'done',
            'decision'   => 'need_info',
            'reason'     => $request->note,
            'approved_at' => now(),
        ]);

        // RFC bisa kamu set ke under_review supaya kelihatan butuh info
        $rfc->update([
            'status' => 'under_review',
        ]);

        return response()->json([
            'message' => 'RFC ditandai sebagai Need Info',
        ]);
    }

    /**
     * POST /api/v1/rfc/{rfc}/forward
     * Catatan: mirip approve tapi decision = forward
     */
    public function forward(Rfc $rfc, Request $request)
    {
        $request->validate([
            'note'   => 'nullable|string',
            'tujuan' => 'required|string|in:kepala_seksi,kepala_bidang,kepala_dinas,admin_kota',
        ]);

        $user = $request->user();
        $approval = $this->getPendingApprovalForUser($rfc, $user);

        if (!$approval) {
            return response()->json([
                'message' => 'Tidak ada approval pending untuk user ini'
            ], 403);
        }

        $approval->update([
            'status'     => 'done',
            'decision'   => 'forward',
            'reason'     => $request->note,
            'approved_at' => now(),
        ]);

        // Tentukan level tujuan berdasarkan input 'tujuan' dari frontend
        $nextLevel = $request->tujuan;
        RfcApproval::create([
            'rfc_id'      => $rfc->id,
            'approver_id' => $this->getApproverIdByLevel($rfc, $nextLevel),
            'level'       => $nextLevel,
            'status'      => 'pending',
        ]);

        $rfc->update([
            'status' => 'approval_pending',
        ]);

        return response()->json([
            'message' => 'RFC berhasil diteruskan ke level berikutnya',
        ]);
    }

    /**
     * Helper: map dari level sekarang -> level berikutnya
     */
    protected function getNextLevel(string $currentLevel): ?string
    {
        $map = [
            'kepala_seksi'  => 'kepala_bidang',
            'kepala_bidang' => 'kepala_dinas',
            'kepala_dinas'  => 'admin_dinas',
            'admin_dinas'   => null, // terakhir
        ];

        return $map[$currentLevel] ?? null;
    }

    /**
     * Helper: dapatkan approver_id berdasarkan level
     * NOTE: ini dummy — sesuaikan dengan struktur user/opd kamu
     */
    protected function getApproverIdByLevel(Rfc $rfc, string $level): ?int
    {
        // Contoh: kamu bisa ambil dari relasi OPD, atau dari tabel mapping jabatan
        // Untuk sementara, return null dulu
        return null;
    }
}
