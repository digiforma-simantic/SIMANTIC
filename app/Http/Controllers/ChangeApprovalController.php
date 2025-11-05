<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ChangeApprovalController extends Controller
{
    public function decide(string $id, Request $req) {
        $data = $req->validate([
            'decision' => 'required|in:approve,reject,need_info',
            'note'     => 'nullable|string',
        ]);

        // pastikan change ada
        $exists = DB::table('change_requests')->where('id',$id)->exists();
        if (!$exists) return response()->json(['message'=>'Change not found'],404);

        $u = $req->user();
        $new = match($data['decision']) {
            'approve'   => 'Approved',
            'reject'    => 'Rejected',
            'need_info' => 'In-Review',
        };

        DB::beginTransaction();
        try {
            DB::table('change_approvals')->insert([
                'id'          => (string) Str::uuid(),
                'change_id'   => $id,
                'approver_id' => $u->id,
                'stage'       => $u->stage ?? ($u->role ?? 'operator'),
                'decision'    => $data['decision'],
                'note'        => $data['note'] ?? null,
                'decided_at'  => now(),
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);

            DB::table('change_requests')->where('id',$id)->update([
                'status'     => $new,
                'updated_at' => now(),
            ]);

            DB::commit();
            return response()->json(['ok'=>true,'new_status'=>$new], 200);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['ok'=>false,'message'=>$e->getMessage()], 500);
        }
    }

    // alias opsional biar enak dipanggil
    public function approve(string $id, Request $r) { $r->merge(['decision'=>'approve']); return $this->decide($id,$r); }
    public function reject (string $id, Request $r) { $r->merge(['decision'=>'reject']);  return $this->decide($id,$r); }
}
