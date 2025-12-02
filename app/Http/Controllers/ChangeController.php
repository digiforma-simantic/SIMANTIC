<?php

namespace App\Http\Controllers;

use App\Models\Rfc;
use App\Models\RiskRegister;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * @OA\Tag(
 *     name="Change Management",
 *     description="Pengelolaan Request for Change (RFC) menjadi Change Request penuh, termasuk detail dan penilaian risiko"
 * )
 */
class ChangeController extends Controller
{
    /**
     * @OA\Get(
     *   path="/api/v1/changes",
     *   tags={"Change Management"},
     *   summary="List Change Requests (Service Desk RFCs)",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(
     *     name="priority",
     *     in="query",
     *     required=false,
     *     description="Filter by priority (low, medium, high)",
     *     @OA\Schema(type="string", example="high")
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="List of RFCs from Service Desk",
     *     @OA\JsonContent(
     *       type="array",
     *       @OA\Items(
     *         @OA\Property(property="id", type="integer", example=101),
     *         @OA\Property(property="rfc_service_id", type="string", example="SD-2025-001"),
     *         @OA\Property(property="title", type="string", example="Upgrade Database SIM Pegawai"),
     *         @OA\Property(property="priority", type="string", example="high")
     *       )
     *     )
     *   )
     * )
     */
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

    /**
     * @OA\Get(
     *   path="/api/v1/changes/{id}",
     *   tags={"Change Management"},
     *   summary="Show RFC details from Service Desk",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(
     *     name="id",
     *     in="path",
     *     required=true,
     *     description="RFC ID",
     *     @OA\Schema(type="integer", example=101)
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="RFC details",
     *     @OA\JsonContent(
     *       @OA\Property(property="id", type="integer", example=101),
     *       @OA\Property(property="rfc_service_id", type="string", example="SD-2025-001"),
     *       @OA\Property(property="title", type="string", example="Upgrade Database SIM Pegawai"),
     *       @OA\Property(property="description", type="string", example="Perlu upgrade PostgreSQL"),
     *       @OA\Property(property="priority", type="string", example="high"),
     *       @OA\Property(property="asset_uuid", type="string", example="uuid-123"),
     *       @OA\Property(property="sso_id", type="string", example="sso-456"),
     *       @OA\Property(property="requested_at", type="string", example="2025-11-20 10:30:00"),
     *       @OA\Property(property="attachments", type="array", @OA\Items(type="string"))
     *     )
     *   ),
     *   @OA\Response(response=404, description="RFC not found")
     * )
     */
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

    /**
     * @OA\Post(
     *   path="/api/v1/changes",
     *   tags={"Change Management"},
     *   summary="Create Change Request - DEPRECATED (RFC now Service Desk only)",
     *   deprecated=true,
     *   security={{"bearerAuth":{}}},
     *   @OA\Response(
     *     response=501,
     *     description="RFC creation disabled - RFCs are now created via Service Desk integration only"
     *   )
     * )
     */
    public function store(Request $request)
    {
        return response()->json([
            'message' => 'RFC creation through Change Management is disabled. RFCs are now created via Service Desk integration only.',
        ], 501);
    }
}
