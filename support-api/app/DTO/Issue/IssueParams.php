<?php

namespace App\DTO\Issue;

readonly class IssueParams
{
    public function __construct(
        public string $title,
        public string $description,
        public string $priority,
        public string $category,
        public string $status,
        public ?bool $is_escalated,
        public ?string $escalated_at,
        public ?string $acknowledged_at,
        public ?string $resolved_at,
        public ?string $due_at,
        public ?string $summary,
        public ?string $suggested_action,
    ) {
    }

    public function toUpdatePayload(): array
    {
        return array_filter([
            'title' => $this->title,
            'description' => $this->description,
            'priority' => $this->priority,
            'category' => $this->category,
            'status' => $this->status,
            'is_escalated' => $this->is_escalated,
            'escalated_at' => $this->escalated_at,
            'acknowledged_at' => $this->acknowledged_at,
            'resolved_at' => $this->resolved_at,
            'due_at' => $this->due_at,
            'summary' => $this->summary,
            'suggested_action' => $this->suggested_action,
        ], fn ($value) => $value !== null);
    }
}
