<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTicketRequest extends FormRequest
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
            'services' => 'required|array|min:1|exists:services,id',
            'is_preferential' => 'sometimes|boolean',
            'booth_id' => 'nullable|exists:booths,id',
            'status' => 'sometimes|in:pending,called,attended,cancelled,solved',
            'audio' => 'nullable|string',
        ];
    }
}
