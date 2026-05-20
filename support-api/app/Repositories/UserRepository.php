<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Collection;

class UserRepository
{
    public function all(User $user): Collection
    {
        $users = User::query()
            ->select([
                'id',
                'name',
            ])
            // Add temporary fix to limit non-admin users to only see themselves until proper permissions are implemented
            ->when(!$user->isAdmin(), function ($query) use ($user) {
                $query->where('id', $user->id);
            })
            ->get();

        return $users;
    }
}
