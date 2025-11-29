<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Notifications",
 *     description="Notifikasi untuk user pengaju / pengguna aplikasi"
 * )
 */
class NotificationController extends Controller
{
    /**
     * GET /api/v1/notifications
     *
     * Menampilkan daftar notifikasi milik user login.
     *
     * @OA\Get(
     *   path="/api/v1/notifications",
     *   tags={"Notifications"},
     *   summary="Daftar notifikasi user login",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(
     *     name="only_unread",
     *     in="query",
     *     required=false,
     *     description="Jika =1, hanya ambil notifikasi yang belum dibaca",
     *     @OA\Schema(type="integer", example=1)
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Berhasil mengambil daftar notifikasi",
     *     @OA\JsonContent(type="array",
     *       @OA\Items(
     *         @OA\Property(property="id", type="integer", example=10),
     *         @OA\Property(property="title", type="string", example="Permintaan disetujui"),
     *         @OA\Property(property="message", type="string", example="Perubahan \"Install Aplikasi Kerja\" telah disetujui Kepala Dinas."),
     *         @OA\Property(property="ref_type", type="string", example="rfc"),
     *         @OA\Property(property="ref_id", type="integer", example=5),
     *         @OA\Property(property="is_read", type="boolean", example=false),
     *         @OA\Property(property="created_at", type="string", example="2025-08-17T10:30:00Z")
     *       )
     *     )
     *   )
     * )
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc');

        if ($request->boolean('only_unread')) {
            $query->where('is_read', false);
        }

        return $query->paginate(20);
    }

    /**
     * POST /api/v1/notifications/{notification}/read
     *
     * Tandai 1 notifikasi sebagai sudah dibaca.
     */
    public function markAsRead(Request $request, Notification $notification)
    {
        if ($notification->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if (! $notification->is_read) {
            $notification->is_read = true;
            $notification->read_at = now();
            $notification->save();
        }

        return response()->json(['message' => 'Notification marked as read']);
    }
}
