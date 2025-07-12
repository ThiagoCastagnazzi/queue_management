<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAttendanceRequest extends FormRequest
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
            'user_id' => 'sometimes|exists:users,id',
            'ticket_id' => 'sometimes|exists:tickets,id',
            'booth_id' => 'sometimes|exists:booths,id',
            'start_time' => 'sometimes|date',
            'finish_time' => 'nullable|date',
            'status' => 'sometimes|in:pending,in_progress,finished,cancelled',
            'text' => 'nullable|string',
            'rating' => 'nullable|integer|min:1|max:5',
        ];
    }
}
