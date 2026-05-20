<?php

namespace App\Http\Requests\Issue;

use App\DTO\Issue\IssueParams;
use App\Enums\Issue\Category;
use App\Enums\Issue\Priority;
use App\Enums\Issue\Status;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IssueUpdateRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'priority' => ['required', Rule::in(Priority::toArray())],
            'category' => ['required', Rule::in(Category::toArray())],
            'status' => ['required', Rule::in(Status::toArray())],
            'is_escalated' => ['nullable', 'boolean'],
            'escalated_at' => ['nullable', 'date_format:Y-m-d H:i:s'],
            'acknowledged_at' => ['nullable', 'date_format:Y-m-d H:i:s'],
            'resolved_at' => ['nullable', 'date_format:Y-m-d H:i:s'],
            'due_at' => ['nullable', 'date_format:Y-m-d H:i:s'],
            'summary' => ['nullable', 'string'],
            'suggested_action' => ['nullable', 'string'],
        ];
    }

    public function toDTO(): IssueParams
    {
        return new IssueParams(
            $this->validated('title'),
            $this->validated('description'),
            $this->validated('priority'),
            $this->validated('category'),
            $this->validated('status'),
            $this->validated('is_escalated'),
            $this->validated('escalated_at'),
            $this->validated('acknowledged_at'),
            $this->validated('resolved_at'),
            $this->validated('due_at'),
            $this->validated('summary'),
            $this->validated('suggested_action'),
        );
    }
}
