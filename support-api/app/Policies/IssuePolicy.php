<?php

namespace App\Policies;

use App\Models\Issue;
use App\Models\User;

class IssuePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Issue $issue): bool
    {
        return $user->is_admin
            || $issue->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Issue $issue): bool
    {
        return $user->is_admin
            || $issue->user_id === $user->id;
    }

    public function delete(User $user, Issue $issue): bool
    {
        return $user->is_admin
            || $issue->user_id === $user->id;
    }
}
