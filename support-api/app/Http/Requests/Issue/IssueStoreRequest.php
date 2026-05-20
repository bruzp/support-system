<?php

namespace App\Http\Requests\Issue;

use App\DTO\Issue\PartialIssueParams;
use App\Enums\Issue\Category;
use App\Enums\Issue\Priority;
use App\Enums\Issue\Status;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IssueStoreRequest extends FormRequest
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
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'priority' => ['required', Rule::in(Priority::toArray())],
            'category' => ['required', Rule::in(Category::toArray())],
            'status' => ['required', Rule::in(Status::toArray())],
        ];
    }

    public function toDTO(): PartialIssueParams
    {
        return new PartialIssueParams(
            $this->validated('user_id'),
            $this->validated('title'),
            $this->validated('description'),
            $this->validated('priority'),
            $this->validated('category'),
            $this->validated('status'),
        );
    }
}
