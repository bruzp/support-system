<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Collection;

class UserRepository
{
    public function all(): Collection
    {
        $users = User::query()
            ->select([
                'id',
                'name',
            ])->get();

        return $users;
    }
}
