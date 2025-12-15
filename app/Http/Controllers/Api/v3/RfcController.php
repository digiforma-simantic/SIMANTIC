<?php

namespace App\Http\Controllers\Api\v3;

use App\Http\Controllers\Controller;
use App\Models\Rfc;
use App\Models\RfcApproval;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RfcController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v3/rfc",
     *     tags={"RFC"},
     *     summary="Get list of RFCs",
     *     description="Retrieve a paginated list of Request for Change (RFC) records with optional status filtering",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         description="Filter by RFC status. Use 'null' to get RFCs with null status",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             enum={"pending", "approved", "rejected", "null"}
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         description="Number of items per page (default: 4)",
     *         required=false,
     *         @OA\Schema(type="integer", default=4)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="success"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="rfc_service_id", type="integer", nullable=true),
     *                     @OA\Property(property="ci_code", type="string", nullable=true),
     *                     @OA\Property(property="title", type="string", example="Update Production Server"),
     *                     @OA\Property(property="description", type="string", nullable=true),
     *                     @OA\Property(property="priority", type="string", example="high"),
     *                     @OA\Property(property="status", type="string", example="pending"),
     *                     @OA\Property(property="config_comment", type="string", nullable=true),
     *                     @OA\Property(property="attachments", type="array", @OA\Items(), nullable=true),
     *                     @OA\Property(property="requested_at", type="string", format="date-time", nullable=true),
     *                     @OA\Property(property="asset_uuid", type="string", nullable=true),
     *                     @OA\Property(property="sso_id", type="integer", nullable=true),
     *                     @OA\Property(property="created_at", type="string", format="date-time"),
     *                     @OA\Property(property="updated_at", type="string", format="date-time")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function index(Request $request)
    {
        $query = Rfc::query();

        if ($request->status === 'null') {
            $query->whereNull('status');
        } else if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $rfcs = $query->paginate($request->get('per_page', 4));

        // Ambil data user SSO dari API eksternal untuk setiap RFC
        $client = new Client();
        $rfcs->getCollection()->transform(function ($rfc) use ($client) {
            $userSso = null;
            if ($rfc->sso_id) {
                try {
                    $response = $client->get('https://api.bispro.digitaltech.my.id/api/v2/auth/user/' . $rfc->sso_id, [
                        'headers' => [
                            'accept' => 'application/json',
                        ],
                        'timeout' => 5,
                    ]);
                    $body = json_decode($response->getBody(), true);
                    $userSso = $body['data'] ?? null;
                } catch (\Exception $e) {
                    $userSso = null;
                }
            }
            $rfc->user_sso = $userSso;
            return $rfc;
        });

        return response()->json([
            'message' => 'success',
            'data' => $rfcs,
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/v3/rfc/{id}",
     *     tags={"RFC"},
     *     summary="Get RFC by ID",
     *     description="Retrieve a single Request for Change (RFC) record by its ID",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="RFC ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="success"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="rfc_service_id", type="integer", nullable=true),
     *                 @OA\Property(property="ci_code", type="string", nullable=true),
     *                 @OA\Property(property="title", type="string", example="Update Production Server"),
     *                 @OA\Property(property="description", type="string", nullable=true),
     *                 @OA\Property(property="priority", type="string", example="high"),
     *                 @OA\Property(property="status", type="string", example="pending"),
     *                 @OA\Property(property="config_comment", type="string", nullable=true),
     *                 @OA\Property(property="attachments", type="array", @OA\Items(), nullable=true),
     *                 @OA\Property(property="requested_at", type="string", format="date-time", nullable=true),
     *                 @OA\Property(property="asset_uuid", type="string", nullable=true),
     *                 @OA\Property(property="sso_id", type="integer", nullable=true),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="RFC not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="RFC not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function show($id)
    {
        $rfc = Rfc::find($id);

        if (!$rfc) {
            return response()->json([
                'message' => 'RFC not found',
            ], 404);
        }

        // Ambil data user SSO dari API eksternal
        $userSso = null;
        if ($rfc->sso_id) {
            try {
                $client = new Client();
                $response = $client->get('https://api.bispro.digitaltech.my.id/api/v2/auth/user/' . $rfc->sso_id, [
                    'headers' => [
                        'accept' => 'application/json',
                    ],
                    'timeout' => 5,
                ]);
                $body = json_decode($response->getBody(), true);
                $userSso = $body['data'] ?? null;
            } catch (\Exception $e) {
                $userSso = null;
            }
        }
        $rfc->user_sso = $userSso;

        return response()->json([
            'message' => 'success',
            'data' => $rfc,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/v3/rfc/{id}/approval",
     *     tags={"RFC"},
     *     summary="Set or update RFC Approval",
     *     description="Create or update an RFC approval entry for a given RFC and level.",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="RFC ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"level", "approver_id"},
     *             @OA\Property(property="level", type="string", example="kasi", description="Approval level (e.g., kasi, kabid, kadis)"),
     *             @OA\Property(property="approver_id", type="integer", example=2, description="User ID of the approver"),
     *             @OA\Property(property="decision", type="string", nullable=true, example="approve", description="Approval decision (approve, reject, need_info, forward, or null for pending)"),
     *             @OA\Property(property="reason", type="string", nullable=true, example="All requirements met", description="Reason for the decision"),
     *             @OA\Property(property="approved_at", type="string", format="date-time", nullable=true, example="2025-12-16T10:00:00Z", description="Approval timestamp (optional)")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="success"),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="rfc_id", type="integer", example=1),
     *                 @OA\Property(property="level", type="string", example="kasi"),
     *                 @OA\Property(property="approver_id", type="integer", example=2),
     *                 @OA\Property(property="decision", type="string", example="approve"),
     *                 @OA\Property(property="reason", type="string", example="All requirements met"),
     *                 @OA\Property(property="approved_at", type="string", format="date-time", example="2025-12-16T10:00:00Z"),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="RFC not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="RFC not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     )
     * )
     */
    public function setRfcApproval(Request $request, $id)
    {
        $rfc = Rfc::find($id);
        if (!$rfc) {
            return response()->json([
                'message' => 'RFC not found',
            ], 404);
        }

        $data = $request->validate([
            'level' => 'required|string',
            'approver_id' => 'required|integer',
            'decision' => 'nullable|string',
            'reason' => 'nullable|string',
            'approved_at' => 'nullable|date',
        ]);
        $data['rfc_id'] = $rfc->id;


        // Update if exists (by rfc_id, level, approver_id), otherwise create
        $rfcApproval = RfcApproval::updateOrCreate(
            [
                'rfc_id' => $data['rfc_id'],
                'level' => $data['level'],
                'approver_id' => $data['approver_id'],
            ],
            [
                'decision' => $data['decision'] ?? null,
                'reason' => $data['reason'] ?? null,
                'approved_at' => $data['approved_at'] ?? null,
            ]
        );

        return response()->json([
            'message' => 'success',
            'data' => $rfcApproval,
        ]);
    }
}
