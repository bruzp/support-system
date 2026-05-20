<?php

namespace App\Repositories;

use App\DTO\Issue\EscalateIssueParams;
use App\DTO\Issue\FilterParams;
use App\DTO\Issue\IssueParams;
use App\DTO\Issue\PartialIssueParams;
use App\DTO\PagingParams;
use App\Models\Issue;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class IssueRepository
{
    public function all(User $user, FilterParams $filterParams, PagingParams $pagingParams): LengthAwarePaginator
    {
        return Issue::with(['summary', 'user'])
            ->where(function ($query) use ($user, $filterParams) {
                if (!$user->isAdmin()) {
                    $query->where('user_id', $user->id);
                }

                if ($filterParams->priority) {
                    $query->where('priority', $filterParams->priority);
                }

                if ($filterParams->category) {
                    $query->where('category', $filterParams->category);
                }

                if ($filterParams->status) {
                    $query->where('status', $filterParams->status);
                }
            })
            ->orderBy($pagingParams->sortBy, $pagingParams->sortOrder)
            ->paginate($pagingParams->perPage, ['*'], 'page', $pagingParams->page);
    }

    public function findById(int $issueId): Issue
    {
        return Issue::findOrFail($issueId);
    }

    public function store(PartialIssueParams $params): Issue
    {
        return Issue::create($params->toArray());
    }

    public function update(Issue $issue, IssueParams $params): Issue
    {
        $issue->update($params->toUpdatePayload());

        return $issue;
    }

    public function escalate(Issue $issue, EscalateIssueParams $params): Issue
    {
        $issue->update($params->toUpdatePayload());

        return $issue;
    }

    public function delete(Issue $issue): void
    {
        $issue->delete();
    }
}
