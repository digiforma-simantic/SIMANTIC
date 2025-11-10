<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MaintenanceJob;

/**
 * @OA\Tag(
 *     name="Maintenance Management",
 *     description="Penjadwalan dan hasil pekerjaan maintenance (routine, ad-hoc, emergency)"
 * )
 */
class MaintenanceJobController extends Controller
{
       /**
     * GET /api/v1/maintenance-jobs
     *
     * @OA\Get(
     *   path="/api/v1/maintenance-jobs",
     *   tags={"Maintenance Management"},
     *   summary="Daftar maintenance job",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(
     *     name="type",
     *     in="query",
     *     required=false,
     *     description="Filter tipe maintenance (routine_opd, routine_diskominfo, ad_hoc, emergency)",
     *     @OA\Schema(type="string", example="routine_opd")
     *   ),
     *   @OA\Parameter(
     *     name="result",
     *     in="query",
     *     required=false,
     *     description="Filter hasil maintenance (success, partial, failed)",
     *     @OA\Schema(type="string", example="success")
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="List maintenance job",
     *     @OA\JsonContent(
     *       type="array",
     *       @OA\Items(
     *         @OA\Property(property="id", type="integer", example=10),
     *         @OA\Property(property="title", type="string", example="Maintenance Rutin Server SPBE"),
     *         @OA\Property(property="type", type="string", example="routine_opd"),
     *         @OA\Property(property="window_start", type="string", example="2025-11-15T21:00:00+07:00"),
     *         @OA\Property(property="window_end", type="string", example="2025-11-15T23:00:00+07:00"),
     *         @OA\Property(property="result", type="string", example="success")
     *       )
     *     )
     *   )
     * )
     */
    public function index(Request $request)
    {
        $query = MaintenanceJob::query()->orderByDesc('created_at');

        if ($type = $request->query('type')) {
            $query->where('type', $type);
        }

        if ($result = $request->query('result')) {
            $query->where('result', $result);
        }

        $jobs = $query->get();

        return response()->json($jobs);
    }
    /**
     * POST /api/v1/maintenance-jobs
     *
     * @OA\Post(
     *   path="/api/v1/maintenance-jobs",
     *   tags={"Maintenance Management"},
     *   summary="Membuat maintenance job baru",
     *   security={{"bearerAuth":{}}},
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"title","type","window_start","window_end"},
     *       @OA\Property(property="title", type="string", example="Maintenance Rutin Server SPBE"),
     *       @OA\Property(
     *         property="type",
     *         type="string",
     *         example="routine_opd",
     *         enum={"routine_opd","routine_diskominfo","ad_hoc","emergency"}
     *       ),
     *       @OA\Property(property="window_start", type="string", example="2025-11-15T21:00:00+07:00"),
     *       @OA\Property(property="window_end", type="string", example="2025-11-15T23:00:00+07:00"),
     *       @OA\Property(property="notes", type="string", example="Pengecekan suhu server dan pembersihan debu")
     *     )
     *   ),
     *   @OA\Response(
     *     response=201,
     *     description="Maintenance job berhasil dibuat",
     *     @OA\JsonContent(
     *       @OA\Property(property="id", type="integer", example=10),
     *       @OA\Property(property="title", type="string", example="Maintenance Rutin Server SPBE")
     *     )
     *   ),
     *   @OA\Response(response=422, description="Validasi gagal")
     * )
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'        => 'required|string|max:255',
            'type'         => 'required|in:routine_opd,routine_diskominfo,ad_hoc,emergency',
            'window_start' => 'required|date',
            'window_end'   => 'required|date|after:window_start',
            'notes'        => 'nullable|string|max:1000',
        ]);

        $data['created_by'] = $request->user()->id ?? null;

        $job = MaintenanceJob::create($data);

        return response()->json($job, 201);
    }

    /**
     * GET /api/v1/maintenance-jobs/{maintenance_job}
     *
     * @OA\Get(
     *   path="/api/v1/maintenance-jobs/{id}",
     *   tags={"Maintenance Management"},
     *   summary="Detail satu maintenance job",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(
     *     name="id",
     *     in="path",
     *     required=true,
     *     description="ID maintenance job",
     *     @OA\Schema(type="integer", example=10)
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Detail maintenance job",
     *     @OA\JsonContent(
     *       @OA\Property(property="id", type="integer", example=10),
     *       @OA\Property(property="title", type="string", example="Maintenance Rutin Server SPBE")
     *     )
     *   ),
     *   @OA\Response(response=404, description="Maintenance job tidak ditemukan")
     * )
     */
    public function show(MaintenanceJob $maintenance_job)
    {
        $maintenance_job->load('configurationItems');

        return response()->json($maintenance_job);
    }

    /**
     * POST /api/v1/maintenance-jobs/{job}/result
     *
     * @OA\Post(
     *   path="/api/v1/maintenance-jobs/{id}/result",
     *   tags={"Maintenance Management"},
     *   summary="Mencatat hasil maintenance job",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(
     *     name="id",
     *     in="path",
     *     required=true,
     *     description="ID maintenance job",
     *     @OA\Schema(type="integer", example=10)
     *   ),
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"result"},
     *       @OA\Property(
     *         property="result",
     *         type="string",
     *         example="success",
     *         enum={"success","partial","failed"}
     *       ),
     *       @OA\Property(
     *         property="notes",
     *         type="string",
     *         example="Semua server normal, kecuali CI-302 perlu restart."
     *       )
     *     )
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Hasil maintenance tersimpan"
     *   ),
     *   @OA\Response(response=422, description="Validasi gagal"),
     *   @OA\Response(response=404, description="Maintenance job tidak ditemukan")
     * )
     */
    public function storeResult(Request $request, MaintenanceJob $job)
    {
        $data = $request->validate([
            'result' => 'required|in:success,partial,failed',
            'notes'  => 'nullable|string|max:1000',
        ]);

        $job->update($data);

        return response()->json([
            'message' => 'Result saved',
            'job'     => $job,
        ]);
    }
}
