<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Collection;

class UserService
{
    public function __construct(private readonly UserRepository $userRepository)
    {
    }

    public function list(User $user): Collection
    {
        return $this->userRepository->all($user);
    }
}
