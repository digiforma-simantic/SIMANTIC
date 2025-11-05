<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreChangeRequest;
use App\Models\ChangeRequest;
use App\Models\ConfigurationItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class ChangeController extends Controller
{
    /**
     * GET /api/v1/changes?status=&type=&search=&start=&end=&per_page=
     */
    public function index(Request $req)
    {
        $q = ChangeRequest::query()
            ->when($req->filled('status'), fn($x)=>$x->where('status', $req->status))
            ->when($req->filled('type'),   fn($x)=>$x->where('type',   $req->type))
            ->when($req->filled('search'), fn($x)=>$x->where(function($w) use ($req){
                $w->where('title','like',"%{$req->search}%")
                  ->orWhere('description','like',"%{$req->search}%");
            }))
            ->when($req->filled(['start','end']), fn($x)=>$x->whereBetween('schedule_start', [
                Carbon::parse(request('start'))->startOfMinute(),
                Carbon::parse(request('end'))->endOfMinute(),
            ]))
            ->withCount('cis')
            ->orderByDesc('created_at');

        return $q->paginate($req->integer('per_page', 15));
    }

    /**
     * GET /api/v1/changes/{change}
     * Implicit binding ke App\Models\ChangeRequest (PK BIGINT)
     */
    public function show(ChangeRequest $change)
    {
        $change->load([
            'cis:id,ci_code,name,type',
            'approvals' => fn($q)=>$q->orderByDesc('decided_at'),
        ]);

        return [
            'change'          => $change,
            'affected_ci_ids' => $change->cis->pluck('id'),
            'approvals'       => $change->approvals,
        ];
    }

    /**
     * POST /api/v1/changes
     * Body sesuai StoreChangeRequest
     */
    public function store(StoreChangeRequest $req)
    {
        $data  = $req->validated();
        $start = !empty($data['schedule_start']) ? Carbon::parse($data['schedule_start']) : null;
        $end   = !empty($data['schedule_end'])   ? Carbon::parse($data['schedule_end'])   : null;

        // Validasi keberadaan CI (hardening)
        $exists = ConfigurationItem::whereIn('id', $data['affected_ci_ids'])->count();
        if ($exists !== count($data['affected_ci_ids'])) {
            return response()->json(['message'=>'Some CI not found'], 422);
        }

        // Cek konflik jadwal (overlap) jika ada jadwal
        if ($start && $end) {
            $overlaps = DB::table('change_request_ci as x')
                ->join('change_requests as c','c.id','=','x.change_id')
                ->whereIn('x.ci_id', $data['affected_ci_ids'])
                ->whereIn('c.status', ['Submitted','In-Review','Approved'])
                ->where(function($w) use($start,$end){
                    $w->whereBetween('c.schedule_start', [$start, $end])
                      ->orWhereBetween('c.schedule_end',   [$start, $end])
                      ->orWhere(function($o) use($start,$end){
                          $o->where('c.schedule_start','<=',$start)
                            ->where('c.schedule_end','>=',$end);
                      });
                })
                ->select('x.ci_id','c.id as change_id','c.title','c.schedule_start','c.schedule_end')
                ->limit(5)->get();

            if ($overlaps->count() > 0) {
                return response()->json([
                    'message'   => 'Schedule conflict detected',
                    'conflicts' => $overlaps,
                ], 409);
            }
        }

        // Buat change + attach CI
        return DB::transaction(function () use ($req, $data, $start, $end) {
            $cr = ChangeRequest::create([
                'title'          => $data['title'],
                'type'           => $data['type'],                  // standard|minor|major|emergency
                'description'    => $data['description']   ?? null,
                'impact_desc'    => $data['impact_desc']   ?? null,
                'rollback_plan'  => $data['rollback_plan'] ?? null,
                'schedule_start' => $start,
                'schedule_end'   => $end,
                'risk_score'     => 0,
                'status'         => 'Submitted',
                'requester_id'   => $req->user()->id,
                'dinas'          => $req->user()->dinas ?? ($data['dinas'] ?? 'UNKNOWN'),
            ]);

            $pivot = collect($data['affected_ci_ids'])
                ->mapWithKeys(fn($ci) => [$ci => ['impact_level' => $data['impact_level'] ?? 'med']])
                ->all();

            $cr->cis()->attach($pivot);

            return response()->json(['id'=>$cr->id,'status'=>$cr->status], 201);
        });
    }
}
