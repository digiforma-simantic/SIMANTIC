<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Carbon\Carbon;

// ...existing code...
class NotificationController extends Controller
{
    // ...existing code...
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

    // ...existing code...
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
