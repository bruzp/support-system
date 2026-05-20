<?php

namespace App\Services;

use App\DTO\Issue\EscalateIssueParams;
use App\DTO\Issue\FilterParams;
use App\DTO\Issue\IssueParams;
use App\DTO\Issue\PartialIssueParams;
use App\DTO\IssueAiResult\IssueAiResultParams;
use App\DTO\PagingParams;
use App\Enums\Issue\Priority;
use App\Enums\Issue\Status;
use App\Models\Issue;
use App\Models\User;
use App\Repositories\IssueAiResultRepository;
use App\Repositories\IssueRepository;
use App\Services\AI\AISummaryService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class Issueservice
{
    public function __construct(
        private readonly IssueRepository $issueRepository,
        private readonly IssueAiResultRepository $issueAiResultRepository,
        private readonly AISummaryService $aiSummaryService,
    ) {
    }

    public function list(User $user, FilterParams $filterParams, PagingParams $pagingParams): LengthAwarePaginator
    {
        return $this->issueRepository->all($user, $filterParams, $pagingParams);
    }

    public function findOrFail(int $issueId): Issue
    {
        return $this->issueRepository->findById($issueId);
    }

    public function findOrFailWithSummary(int $issueId): Issue
    {
        $issue = $this->issueRepository->findById($issueId);
        return $issue->load('summary');
    }

    public function create(PartialIssueParams $params): Issue
    {
        return DB::transaction(function () use ($params) {
            $issue = $this->issueRepository->store($params);

            $this->createSummary($issue);

            return $issue->load('summary');
        });
    }

    public function update(Issue $issue, IssueParams $params): Issue
    {
        return DB::transaction(function () use ($issue, $params) {
            $updateIssue = $this->issueRepository->update($issue, $params);
            $updateIssue->load('summary');

            $this->updateSummary($updateIssue, $params);

            $this->checkEscalation($updateIssue);

            return $updateIssue;
        });
    }

    public function delete(Issue $issue): void
    {
        $this->issueRepository->delete($issue);
    }

    // TODO: Add queue to handle escalation
    private function checkEscalation(Issue $issue): void
    {
        if ($this->shouldEscalate($issue) && !$issue->is_escalated) {
            $this->issueRepository->escalate($issue, new EscalateIssueParams(
                is_escalated: true,
                escalated_at: Carbon::now(),
            ));
        }
    }

    private function shouldEscalate(Issue $issue): bool
    {
        if ($issue->priority === Priority::CRITICAL) {
            return true;
        }

        if ($issue->priority === Priority::HIGH && $issue->created_at->diffInHours(now()) >= 48) {
            return true;
        }

        if ($issue->due_at && $issue->due_at->isPast() && !\in_array($issue->status, [Status::RESOLVED, Status::CLOSED])) {
            return true;
        }

        return false;
    }

    private function createSummary(Issue $issue): void
    {
        $aiSummary = $this->aiSummaryService->generate($issue);
        $aiSummaryParams = IssueAiResultParams::fromArray($aiSummary);
        $this->issueAiResultRepository->store($issue, $aiSummaryParams);
    }

    private function updateSummary(Issue $issue, IssueParams $params): void
    {
        if (filled($params->summary) || filled($params->suggested_action)) {
            $this->issueAiResultRepository->update($issue->summary, $params->summary, $params->suggested_action);
        }
    }
}
