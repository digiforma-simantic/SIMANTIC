<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MaintenanceJob;

// ...existing code...
class MaintenanceJobController extends Controller
{
        // ...existing code...
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
    // ...existing code...
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

    // ...existing code...
    public function show(MaintenanceJob $maintenance_job)
    {
        $maintenance_job->load('configurationItems');

        return response()->json($maintenance_job);
    }

    // ...existing code...
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
