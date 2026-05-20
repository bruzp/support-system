<?php

namespace App\Http\Resources\IssueAiResult;

use App\Models\IssueAiResult;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IssueAiResultResource extends JsonResource
{
    public static $wrap = null;

    public function __construct(IssueAiResult $resource)
    {
        parent::__construct($resource);
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'issue_id' => $this->resource->issue_id,
            'summary' => $this->resource->summary,
            'suggested_action' => $this->resource->suggested_action,
            'is_fallback' => $this->resource->is_fallback,
            'is_user_edited' => $this->resource->is_user_edited,
        ];
    }
}
