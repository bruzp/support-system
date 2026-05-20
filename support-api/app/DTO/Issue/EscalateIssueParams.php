<?php

namespace App\DTO\Issue;

use Illuminate\Support\Carbon;

readonly class EscalateIssueParams
{
    public function __construct(
        public bool $is_escalated,
        public Carbon $escalated_at,
    ) {
    }

    public function toUpdatePayload(): array
    {
        return [
            'is_escalated' => $this->is_escalated,
            'escalated_at' => $this->escalated_at,
        ];
    }
}
