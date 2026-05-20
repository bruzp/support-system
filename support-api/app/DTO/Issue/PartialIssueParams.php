<?php

namespace App\DTO\Issue;

readonly class PartialIssueParams
{
    public function __construct(
        public int $user_id,
        public string $title,
        public string $description,
        public string $priority,
        public string $category,
        public string $status,
    ) {
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->user_id,
            'title' => $this->title,
            'description' => $this->description,
            'priority' => $this->priority,
            'category' => $this->category,
            'status' => $this->status,
        ];
    }
}
