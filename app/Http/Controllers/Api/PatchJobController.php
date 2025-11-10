<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PatchDeployment;

/**
 * @OA\Tag(
 *     name="Patch Deployment",
 *     description="Penjadwalan dan pelaksanaan patch deployment ke Configuration Item (CI)"
 * )
 */
class PatchJobController extends Controller
{
    /**
     * GET /api/v1/patch-jobs
     *
     * @OA\Get(
     *   path="/api/v1/patch-jobs",
     *   tags={"Patch Deployment"},
     *   summary="Daftar patch job",
     *   security={{"bearerAuth":{}}},
     *   @OA\Response(
     *     response=200,
     *     description="List patch job",
     *     @OA\JsonContent(
     *       type="array",
     *       @OA\Items(
     *         @OA\Property(property="id", type="integer", example=5),
     *         @OA\Property(property="patch_id", type="integer", example=1),
     *         @OA\Property(property="type", type="string", example="scheduled"),
     *         @OA\Property(property="status", type="string", example="planned"),
     *         @OA\Property(property="window_start", type="string", example="2025-11-18T21:00:00+07:00"),
     *         @OA\Property(property="window_end", type="string", example="2025-11-18T23:00:00+07:00")
     *       )
     *     )
     *   )
     * )
     */
    public function index()
    {
        $jobs = PatchDeployment::with('patch', 'configurationItems')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($jobs);
    }

    /**
     * POST /api/v1/patch-jobs
     *
     * @OA\Post(
     *   path="/api/v1/patch-jobs",
     *   tags={"Patch Deployment"},
     *   summary="Menjadwalkan patch job baru",
     *   security={{"bearerAuth":{}}},
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"patch_id","ci_ids"},
     *       @OA\Property(property="patch_id", type="integer", example=1),
     *       @OA\Property(
     *         property="ci_ids",
     *         type="array",
     *         @OA\Items(type="integer", example=301)
     *       ),
     *       @OA\Property(
     *         property="type",
     *         type="string",
     *         example="scheduled",
     *         enum={"scheduled","ad_hoc","emergency"}
     *       ),
     *       @OA\Property(property="window_start", type="string", example="2025-11-18T21:00:00+07:00"),
     *       @OA\Property(property="window_end", type="string", example="2025-11-18T23:00:00+07:00"),
     *       @OA\Property(property="rollback_plan", type="string", example="Rollback ke snapshot sebelum patch"),
     *       @OA\Property(property="notes", type="string", example="Prioritaskan CI kritis terlebih dahulu")
     *     )
     *   ),
     *   @OA\Response(
     *     response=201,
     *     description="Patch job berhasil dibuat",
     *     @OA\JsonContent(
     *       @OA\Property(property="id", type="integer", example=5),
     *       @OA\Property(property="patch_id", type="integer", example=1),
     *       @OA\Property(property="status", type="string", example="planned")
     *     )
     *   ),
     *   @OA\Response(response=422, description="Validasi gagal")
     * )
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'patch_id'      => 'required|integer|exists:patch_catalogs,id',
            'ci_ids'        => 'required|array|min:1',
            'ci_ids.*'      => 'integer|exists:configuration_items,id',
            'type'          => 'nullable|in:scheduled,ad_hoc,emergency',
            'window_start'  => 'nullable|date',
            'window_end'    => 'nullable|date|after:window_start',
            'rollback_plan' => 'nullable|string',
            'notes'         => 'nullable|string',
        ]);

        $job = PatchDeployment::create([
            'patch_id'      => $data['patch_id'],
            'type'          => $data['type'] ?? 'scheduled',
            'window_start'  => $data['window_start'] ?? null,
            'window_end'    => $data['window_end'] ?? null,
            'rollback_plan' => $data['rollback_plan'] ?? null,
            'notes'         => $data['notes'] ?? null,
            'status'        => 'planned',
        ]);

        // relasi many-to-many ke CI
        $job->configurationItems()->sync($data['ci_ids']);

        $job->load('patch', 'configurationItems');

        return response()->json($job, 201);
    }

    /**
     * GET /api/v1/patch-jobs/{patch_job}
     *
     * @OA\Get(
     *   path="/api/v1/patch-jobs/{id}",
     *   tags={"Patch Deployment"},
     *   summary="Detail satu patch job",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(
     *     name="id",
     *     in="path",
     *     required=true,
     *     description="ID patch job",
     *     @OA\Schema(type="integer", example=5)
     *   ),
     *   @OA\Response(
     *     response=200,
     *     description="Detail patch job",
     *     @OA\JsonContent(
     *       @OA\Property(property="id", type="integer", example=5),
     *       @OA\Property(property="patch_id", type="integer", example=1),
     *       @OA\Property(property="status", type="string", example="planned")
     *     )
     *   ),
     *   @OA\Response(response=404, description="Patch job tidak ditemukan")
     * )
     */
    public function show(PatchDeployment $patch_job)
    {
        $patch_job->load('patch', 'configurationItems');

        return response()->json($patch_job);
    }

    /**
     * POST /api/v1/patch-jobs/{job}/deploy
     *
     * @OA\Post(
     *   path="/api/v1/patch-jobs/{id}/deploy",
     *   tags={"Patch Deployment"},
     *   summary="Mencatat hasil deployment patch job",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(
     *     name="id",
     *     in="path",
     *     required=true,
     *     description="ID patch job",
     *     @OA\Schema(type="integer", example=5)
     *   ),
     *   @OA\RequestBody(
     *     required=false,
     *     @OA\JsonContent(
     *       @OA\Property(
     *         property="status",
     *         type="string",
     *         example="deployed",
     *         enum={"planned","deployed","failed","rolled_back"}
     *       ),
     *       @OA\Property(
     *         property="notes",
     *         type="string",
     *         example="Berhasil deploy ke semua CI, tidak perlu rollback."
     *       )
     *     )
     *   ),
     *   @OA\Response(response=200, description="Deployment status tersimpan"),
     *   @OA\Response(response=404, description="Patch job tidak ditemukan")
     * )
     */
    public function deploy(Request $request, PatchDeployment $job)
    {
        $data = $request->validate([
            'status' => 'nullable|in:planned,deployed,failed,rolled_back',
            'notes'  => 'nullable|string',
        ]);

        $job->status      = $data['status'] ?? 'deployed';
        $job->notes       = $data['notes'] ?? $job->notes;
        $job->deployed_at = now();
        $job->save();

        return response()->json([
            'message' => 'Deployment updated',
            'job'     => $job,
        ]);
    }

    /**
     * POST /api/v1/patch-jobs/{job}/rollback
     *
     * @OA\Post(
     *   path="/api/v1/patch-jobs/{id}/rollback",
     *   tags={"Patch Deployment"},
     *   summary="Mencatat rollback patch job",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(
     *     name="id",
     *     in="path",
     *     required=true,
     *     description="ID patch job",
     *     @OA\Schema(type="integer", example=5)
     *   ),
     *   @OA\RequestBody(
     *     required=false,
     *     @OA\JsonContent(
     *       @OA\Property(
     *         property="notes",
     *         type="string",
     *         example="Rollback karena aplikasi tidak bisa login setelah patch."
     *       )
     *     )
     *   ),
     *   @OA\Response(response=200, description="Rollback tercatat"),
     *   @OA\Response(response=404, description="Patch job tidak ditemukan")
     * )
     */
    public function rollback(Request $request, PatchDeployment $job)
    {
        $data = $request->validate([
            'notes' => 'nullable|string',
        ]);

        $job->status         = 'rolled_back';
        $job->notes          = $data['notes'] ?? $job->notes;
        $job->rolled_back_at = now();
        $job->save();

        return response()->json([
            'message' => 'Rollback recorded',
            'job'     => $job,
        ]);
    }
}
