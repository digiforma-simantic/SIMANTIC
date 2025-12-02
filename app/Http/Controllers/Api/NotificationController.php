<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Carbon\Carbon;

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

    /**
     * GET /api/v1/notification/staff
     * Return notifications for staff (requester) grouped by today / yesterday.
     *
     * @OA\Get(
     *   path="/api/v1/notification/staff",
     *   tags={"Notifications"},
     *   summary="Daftar notifikasi staf pengaju (grouped: today/yesterday)",
     *   security={{"bearerAuth":{}}},
     *   @OA\Response(
     *     response=200,
     *     description="Berhasil mengambil notifikasi staff (grouped)",
     *     @OA\JsonContent(
     *       type="object",
     *       @OA\Property(property="status", type="boolean", example=true),
     *       @OA\Property(property="data", type="object",
     *         @OA\Property(property="today", type="array", @OA\Items(type="object",
     *           @OA\Property(property="id", type="integer"),
     *           @OA\Property(property="status", type="string"),
     *           @OA\Property(property="description", type="string"),
     *           @OA\Property(property="created_at", type="string"),
     *           @OA\Property(property="time_label", type="string")
     *         )),
     *         @OA\Property(property="yesterday", type="array", @OA\Items(type="object"))
     *       )
     *     )
     *   )
     * )
     */
    public function staff(Request $request)
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['status' => false, 'message' => 'Unauthenticated'], 401);
        }

        $notifications = Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $today = [];
        $yesterday = [];

        foreach ($notifications as $n) {
            $createdAt = Carbon::parse($n->created_at);
            $timeLabel = $this->timeLabel($createdAt);

            $item = [
                'id' => $n->id,
                'status' => $n->title, // map title -> status
                'description' => $n->message,
                'created_at' => $createdAt->toDateTimeString(),
                'time_label' => $timeLabel,
                'is_read' => (bool) ($n->is_read ?? false),
            ];

            if ($createdAt->isToday()) {
                $today[] = $item;
            } elseif ($createdAt->isYesterday()) {
                $yesterday[] = $item;
            } else {
                // group older items together under 'yesterday' (for now)
                $yesterday[] = $item;
            }
        }

        return response()->json([
            'status' => true,
            'data' => [
                'today' => $today,
                'yesterday' => $yesterday,
            ],
        ]);
    }

    /**
     * Helper: compute time label string (Now, 3j (hours), 2h (days))
     */
    protected function timeLabel(Carbon $date)
    {
        $now = Carbon::now();
        $diffSeconds = $now->diffInSeconds($date);
        $diffHours = $now->diffInHours($date);
        $diffDays = $now->diffInDays($date);

        if ($diffSeconds < 60) {
            return 'Now';
        }

        if ($diffHours < 24) {
            return $diffHours . 'j'; // jam
        }

        return $diffDays . 'h'; // hari
    }
}
