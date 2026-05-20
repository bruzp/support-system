<?php

namespace App\DTO\Issue;

readonly class FilterParams
{
    public function __construct(
        public ?string $priority = null,
        public ?string $category = null,
        public ?string $status = null,
    ) {
    }
}
