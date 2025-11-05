<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConfigurationItem;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ConfigurationItemController extends Controller
{
    public function index(Request $r)
    {
        $q = ConfigurationItem::query()
            ->when($r->search, fn($q,$s)=>$q->where(function($x) use($s){
                $x->where('ci_code','like',"%$s%")->orWhere('name','like',"%$s%");
            }))
            ->when($r->type, fn($q,$t)=>$q->where('type',$t))
            ->when($r->status, fn($q,$s)=>$q->where('status',$s))
            ->orderByDesc('created_at');

        return response()->json([
            'data' => $q->paginate($r->integer('per_page', 15))
        ]);
    }

    public function store(Request $r)
    {
        $data = $r->validate([
            'ci_code'   => ['required','string','max:50','unique:configuration_items,ci_code'],
            'name'      => ['required','string','max:200'],
            'type'      => ['required','string','max:50'],
            'owner'     => ['nullable','string','max:100'],
            'status'    => ['nullable', Rule::in(['active','inactive','retired'])],
            'attributes'=> ['nullable','array'],
        ]);

        $ci = ConfigurationItem::create($data);
        return response()->json(['data'=>$ci], 201);
    }

    public function show(ConfigurationItem $config_item)
    {
        return response()->json(['data'=>$config_item]);
    }

    public function update(Request $r, ConfigurationItem $config_item)
    {
        $data = $r->validate([
            'ci_code'   => ['sometimes','string','max:50', Rule::unique('configuration_items','ci_code')->ignore($config_item->id)],
            'name'      => ['sometimes','string','max:200'],
            'type'      => ['sometimes','string','max:50'],
            'owner'     => ['nullable','string','max:100'],
            'status'    => ['nullable', Rule::in(['active','inactive','retired'])],
            'attributes'=> ['nullable','array'],
        ]);

        $config_item->update($data);
        return response()->json(['data'=>$config_item]);
    }

    public function destroy(ConfigurationItem $config_item)
    {
        $config_item->delete();
        return response()->json(null, 204);
    }
}
