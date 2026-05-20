<?php

namespace Database\Seeders;

use App\Models\Issue;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IssueSeeder extends Seeder
{
    public function run(): void
    {
        $limit = 100000;
        $chunkSize = 5000;

        $users = DB::table('users')->get();

        $priorities = ['low', 'medium', 'high', 'critical'];

        $categories = [
            'bug',
            'feature_request',
            'infrastructure',
            'security',
            'billing',
            'general',
        ];

        $statuses = [
            'open',
            'in_progress',
            'on_hold',
            'resolved',
            'closed',
        ];

        for ($i = 0; $i < $limit; $i += $chunkSize) {
            $issues = [];
            $titles = [];
            $now = now();

            for ($j = 0; $j < $chunkSize; $j++) {
                $number = $i + $j;

                $title = 'Issue #' . $number;

                $titles[] = $title;

                $isEscalated = random_int(0, 1) === 1;

                $escalatedAt = $isEscalated
                    ? now()->subDays(random_int(1, 30))
                    : null;

                $acknowledgedAt = random_int(0, 1)
                    ? now()->subDays(random_int(1, 20))
                    : null;

                $resolvedAt = random_int(0, 1)
                    ? now()->subDays(random_int(1, 10))
                    : null;

                $dueAt = now()->addDays(random_int(1, 30));

                $issues[] = [
                    'user_id' => $users->random()->id,
                    'title' => $title,
                    'description' =>
                        'This is a generated issue description for issue #' . $number,
                    'priority' =>
                        $priorities[array_rand($priorities)],
                    'category' =>
                        $categories[array_rand($categories)],
                    'status' =>
                        $statuses[array_rand($statuses)],
                    'is_escalated' => $isEscalated,
                    'escalated_at' => $escalatedAt,
                    'acknowledged_at' => $acknowledgedAt,
                    'resolved_at' => $resolvedAt,
                    'due_at' => $dueAt,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            Issue::insert($issues);

            $insertedIssues = Issue::query()
                ->whereIn('title', $titles)
                ->pluck('id')
                ->toArray();

            $aiResults = [];

            foreach ($insertedIssues as $issueId) {
                $aiResults[] = [
                    'issue_id' => $issueId,
                    'summary' =>
                        'AI generated summary for issue #' . $issueId,
                    'suggested_action' =>
                        'Review logs, investigate the root cause, and coordinate with the assigned team.',
                    'is_fallback' => random_int(0, 1),
                    'is_user_edited' => random_int(0, 1),
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            DB::table('issue_ai_results')->insert($aiResults);
        }
    }
}
