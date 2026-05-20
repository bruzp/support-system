<?php

namespace App\Http\Controllers;

use App\Http\Resources\User\UserCollectionResource;
use App\Services\AuthService;
use App\Services\UserService;

class UserController extends Controller
{
    public function __construct(
        private readonly UserService $userService,
        private readonly AuthService $authService
    ) {
    }

    public function index(): UserCollectionResource
    {
        $user = $this->authService->getAuthenticatedUser();

        $users = $this->userService->list($user);

        return new UserCollectionResource($users);
    }
}
