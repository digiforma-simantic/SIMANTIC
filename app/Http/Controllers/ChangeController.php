<?php

namespace App\Http\Controllers;

use App\Models\Rfc;
use App\Models\RiskRegister;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

// ...existing code...
class ChangeController extends Controller
{
    // ...existing code...
    public function index(Request $request)
    {
        $query = Rfc::orderBy('created_at', 'desc');

        // Optional filter by priority
        if ($priority = $request->query('priority')) {
            $query->where('priority', $priority);
        }

        $changes = $query->paginate(15);

        return response()->json($changes);
    }

    // ...existing code...
    public function show(Request $request, Rfc $change)
    {
        return response()->json([
            'id'              => $change->id,
            'rfc_service_id'  => $change->rfc_service_id,
            'title'           => $change->title,
            'description'     => $change->description,
            'priority'        => $change->priority,
            'asset_uuid'      => $change->asset_uuid,
            'sso_id'          => $change->sso_id,
            'requested_at'    => $change->requested_at,
            'attachments'     => $change->attachments ?? [],
            'created_at'      => $change->created_at,
            'updated_at'      => $change->updated_at,
        ]);
    }

    // ...existing code...
    public function store(Request $request)
    {
        return response()->json([
            'message' => 'RFC creation through Change Management is disabled. RFCs are now created via Service Desk integration only.',
        ], 501);
    }
}
