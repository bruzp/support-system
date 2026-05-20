<?php

namespace App\Services;

use App\Repositories\UserRepository;
use Illuminate\Support\Collection;

class UserService
{
    public function __construct(private readonly UserRepository $userRepository)
    {
    }

    public function list(): Collection
    {
        return $this->userRepository->all();
    }
}
