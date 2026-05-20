<?php

namespace App\DTO\IssueAiResult;

readonly class IssueAiResultParams
{
    public function __construct(
        public string $summary,
        public string $suggested_action,
        public bool $is_fallback,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            summary: $data['summary'],
            suggested_action: $data['suggested_action'],
            is_fallback: $data['is_fallback'],
        );
    }

    public function toArray(): array
    {
        return [
            'summary' => $this->summary,
            'suggested_action' => $this->suggested_action,
            'is_fallback' => $this->is_fallback,
        ];
    }
}
