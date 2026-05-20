<?php

namespace App\Http\Requests\Issue;

use App\DTO\Issue\FilterParams;
use App\DTO\PagingParams;
use App\Enums\Issue\Category;
use App\Enums\Issue\Priority;
use App\Enums\Issue\Status;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IssueFilterRequest extends FormRequest
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
            'priority' => ['nullable', Rule::in(Priority::toArray())],
            'category' => ['nullable', Rule::in(Category::toArray())],
            'status' => ['nullable', Rule::in(Status::toArray())],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function getFilterParams(): FilterParams
    {
        return new FilterParams(
            $this->validated('priority'),
            $this->validated('category'),
            $this->validated('status'),
        );
    }

    public function getPaginatorConfig(): PagingParams
    {
        return new PagingParams(
            ...($this->validated('page') ? ['page' => $this->validated('page')] : []),
        );
    }
}
