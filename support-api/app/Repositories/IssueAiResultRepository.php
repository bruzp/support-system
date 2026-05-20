<?php

namespace App\Repositories;

use App\DTO\IssueAiResult\IssueAiResultParams;
use App\Models\Issue;
use App\Models\IssueAiResult;

class IssueAiResultRepository
{
    public function store(Issue $issue, IssueAiResultParams $params): IssueAiResult
    {
        return IssueAiResult::updateOrCreate(
            ['issue_id' => $issue->id],
            $params->toArray()
        );
    }

    public function update(IssueAiResult $issueAiResult, ?string $summary, ?string $suggestedAction, bool $isUserEdited = true): void
    {
        $updatePayload = [
            'is_user_edited' => $isUserEdited,
        ];

        if (filled($summary)) {
            $updatePayload['summary'] = $summary;
        }

        if (filled($suggestedAction)) {
            $updatePayload['suggested_action'] = $suggestedAction;
        }

        $issueAiResult->update($updatePayload);
    }
}
