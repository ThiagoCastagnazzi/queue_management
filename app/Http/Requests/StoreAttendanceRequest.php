<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttendanceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'ticket_id' => 'required|exists:tickets,id',
            'booth_id' => 'required|exists:booths,id',
            'service_id' => 'required|exists:services,id',
            'start_time' => 'required|date',
            'finish_time' => 'nullable|date',
            'status' => 'sometimes|in:pending,in_progress,finished,cancelled',
            'rating' => 'nullable|integer|min:1|max:5',
        ];
    }
}
