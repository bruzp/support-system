<?php

namespace App\Http\Controllers;

use App\Http\Resources\User\UserCollectionResource;
use App\Services\UserService;

class UserController extends Controller
{
    public function __construct(private readonly UserService $userService)
    {
    }

    public function index(): UserCollectionResource
    {
        $users = $this->userService->list();

        return new UserCollectionResource($users);
    }
}
