<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PatchDeployment;

// ...existing code...
class PatchJobController extends Controller
{
    // ...existing code...
    public function index()
    {
        $jobs = PatchDeployment::with('patch', 'configurationItems')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($jobs);
    }

    // ...existing code...
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

    // ...existing code...
    public function show(PatchDeployment $patch_job)
    {
        $patch_job->load('patch', 'configurationItems');

        return response()->json($patch_job);
    }

    // ...existing code...
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

    // ...existing code...
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
