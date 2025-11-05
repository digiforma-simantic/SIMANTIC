<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreChangeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // izinkan semua user (bisa disesuaikan nanti)
    }

    public function rules(): array
    {
        return [
            'title'           => 'required|string|max:255',
            'type'            => 'required|in:standard,minor,major,emergency',
            'description'     => 'nullable|string',
            'impact_desc'     => 'nullable|string',
            'rollback_plan'   => 'nullable|string',
            'schedule_start'  => 'nullable|date',
            'schedule_end'    => 'nullable|date|after_or_equal:schedule_start',
            'affected_ci_ids' => 'required|array|min:1',
            'affected_ci_ids.*' => 'integer',
            'impact_level'    => 'nullable|in:low,med,high',
        ];
    }
}