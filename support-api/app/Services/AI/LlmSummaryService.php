<?php

namespace App\Services\AI;

use App\Models\Issue;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LlmSummaryService
{
    public function generate(Issue $issue): array
    {
        $host  = config('services.ollama.host');
        $model = config('services.ollama.model');

        if (!$host || !$model) {
            throw new \RuntimeException('Ollama host or model not configured');
        }

        $response = Http::timeout(120)
            ->post("{$host}/v1/chat/completions", [
                'model' => $model,
                'messages' => [
                    ['role' => 'system', 'content' => $this->systemPrompt()],
                    ['role' => 'user', 'content' => $this->buildPrompt($issue)],
                ],
                'format' => 'json',
                'stream' => false,
                'temperature' => 0.2,
            ]);

        if (!$response->ok()) {
            Log::warning('Ollama API error', ['status' => $response->status(), 'body' => $response->body()]);
            throw new \RuntimeException('Ollama unavailable: HTTP ' . $response->status());
        }

        $raw  = $response->json('choices.0.message.content', '');
        $data = json_decode($raw, true);

        if (!$data || empty($data['summary']) || empty($data['suggested_action'])) {
            Log::warning('Ollama unparseable response', ['raw' => $raw]);
            throw new \RuntimeException('Ollama returned unparseable response');
        }

        return [
            'summary' => substr($data['summary'], 0, 500),
            'suggested_action' => $data['suggested_action'],
            'is_fallback' => false,
        ];
    }

    private function systemPrompt(): string
    {
        return <<<SYSTEM
        You are a triage assistant for a support and operations team.
        Given an issue report, respond ONLY with a valid JSON object — no markdown, no explanation, no preamble.
        Use exactly this schema:
        {
          "summary": "<one concise sentence, max 200 characters, plain English>",
          "suggested_action": "<one concrete next step the support agent should take>"
        }
        SYSTEM;
    }

    private function buildPrompt(Issue $issue): string
    {
        return <<<PROMPT
        Issue details:
        - Title: {$issue->title}
        - Category: {$issue->category}
        - Priority: {$issue->priority}
        - Status: {$issue->status}
        - Description: {$issue->description}

        Generate a summary and suggested next action for this issue.
        PROMPT;
    }
}
