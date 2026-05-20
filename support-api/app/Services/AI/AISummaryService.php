<?php

namespace App\Services\AI;

use App\Models\Issue;
use Illuminate\Support\Facades\Log;

class AISummaryService
{
    public function __construct(
        private readonly LlmSummaryService $llm,
        private readonly FallbackSummaryService $fallback,
    ) {
    }

    public function generate(Issue $issue): array
    {
        try {
            return $this->llm->generate($issue);
        } catch (\Throwable $e) {
            Log::warning("LLM failed for issue #{$issue->id}, using fallback. Reason: {$e->getMessage()}");

            return $this->fallback->generate($issue);
        }
    }
}
