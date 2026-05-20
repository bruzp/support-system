<?php

namespace App\Http\Resources\Issue;

use App\Http\Resources\IssueAiResult\IssueAiResultResource;
use App\Http\Resources\User\UserResource;
use App\Models\Issue;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IssueResource extends JsonResource
{
    public static $wrap = null;

    public function __construct(Issue $resource)
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
            'user_id' => $this->resource->user_id,
            'title' => $this->resource->title,
            'description' => $this->resource->description,
            'priority' => $this->resource->priority,
            'category' => $this->resource->category,
            'status' => $this->resource->status,
            'is_escalated' => $this->resource->is_escalated,
            'escalated_at' => $this->resource->escalated_at?->toDateTimeString(),
            'acknowledged_at' => $this->resource->acknowledged_at?->toDateTimeString(),
            'resolved_at' => $this->resource->resolved_at?->toDateTimeString(),
            'due_at' => $this->resource->due_at?->toDateTimeString(),
            'created_at' => $this->resource->created_at?->toDateTimeString(),
            'updated_at' => $this->resource->updated_at?->toDateTimeString(),
            'summary' => $this->whenLoaded('summary', function () {
                return IssueAiResultResource::make($this->resource->summary);
            }),
            'user' => $this->whenLoaded('user', function () {
                return UserResource::make($this->resource->user);
            }),
        ];
    }
}
