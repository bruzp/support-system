<?php

namespace App\Services\AI;

use App\Models\Issue;

class FallbackSummaryService
{
    public function generate(Issue $issue): array
    {
        [$summary, $action] = $this->resolve($issue);

        return [
            'summary' => $summary,
            'suggested_action' => $action,
            'is_fallback' => true,
        ];
    }

    private function resolve(Issue $issue): array
    {
        if ($issue->priority === 'critical' && in_array($issue->status, ['open', 'in_progress'])) {
            return [
                "CRITICAL: {$issue->title} — requires immediate attention.",
                'Assign to a senior engineer immediately and notify the on-call team.',
            ];
        }

        if ($issue->priority === 'high') {
            return [
                "High-priority issue reported: {$issue->title}.",
                'Assign to available team member and respond to the reporter within 1 hour.',
            ];
        }

        return match ($issue->category) {
            'bug' => $this->bugRule($issue),
            'security' => $this->securityRule($issue),
            'infrastructure' => $this->infraRule($issue),
            'billing' => $this->billingRule($issue),
            'feature_request' => $this->featureRule($issue),
            default => $this->genericRule($issue),
        };
    }

    private function bugRule(Issue $issue): array
    {
        return [
            "Bug reported: {$issue->title}. Awaiting reproduction and triage.",
            'Ask the reporter for reproduction steps, affected version, and environment details.',
        ];
    }

    private function securityRule(Issue $issue): array
    {
        return [
            "Security concern flagged: {$issue->title}. Treat as sensitive.",
            'Do NOT discuss details in public channels. Escalate to the security lead privately.',
        ];
    }

    private function infraRule(Issue $issue): array
    {
        return [
            "Infrastructure issue logged: {$issue->title}.",
            'Check monitoring dashboards and recent deployment logs for related anomalies.',
        ];
    }

    private function billingRule(Issue $issue): array
    {
        return [
            "Billing issue submitted: {$issue->title}.",
            'Verify the account record and contact the billing team to review the transaction.',
        ];
    }

    private function featureRule(Issue $issue): array
    {
        return [
            "Feature request received: {$issue->title}.",
            'Log in the product backlog and acknowledge receipt to the reporter within 24 hours.',
        ];
    }

    private function genericRule(Issue $issue): array
    {
        return [
            "Issue submitted: {$issue->title}. Pending initial review.",
            'Review the description, clarify with the reporter if needed, and assign to the relevant team.',
        ];
    }
}
