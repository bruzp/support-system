<?php

namespace App\Http\Controllers;

use App\Http\Requests\Issue\IssueFilterRequest;
use App\Http\Requests\Issue\IssueStoreRequest;
use App\Http\Requests\Issue\IssueUpdateRequest;
use App\Http\Resources\Issue\IssueResource;
use App\Services\AuthService;
use App\Services\Issueservice;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

class IssueController extends Controller
{
    public function __construct(
        private readonly Issueservice $issueService,
        private readonly AuthService $authService
    ) {
    }

    public function index(IssueFilterRequest $request)
    {
        $user = $this->authService->getAuthenticatedUser();

        $issues = $this->issueService->list(
            $user,
            $request->getFilterParams(),
            $request->getPaginatorConfig()
        );

        return IssueResource::collection($issues);
    }

    public function show(int $issueId): IssueResource
    {
        $issue = $this->issueService->findOrFailWithSummary($issueId);

        Gate::authorize('view', $issue);

        return new IssueResource($issue);
    }

    public function store(IssueStoreRequest $request): IssueResource
    {
        $issue = $this->issueService->create($request->toDTO());

        return new IssueResource($issue);
    }

    public function update(int $issueId, IssueUpdateRequest $request): IssueResource
    {
        $issue = $this->issueService->findOrFail($issueId);

        Gate::authorize('update', $issue);

        $this->issueService->update($issue, $request->toDTO());

        $issue->refresh();

        return new IssueResource($issue);
    }

    public function destroy(int $issueId): Response
    {
        $issue = $this->issueService->findOrFail($issueId);

        Gate::authorize('update', $issue);

        $this->issueService->delete($issue);

        return response()->noContent();
    }
}
