<?php

namespace App\Enums\Issue;

enum Status: string
{
    case OPEN = 'open';
    case IN_PROGRESS = 'in_progress';
    case ON_HOLD = 'on_hold';
    case RESOLVED = 'resolved';
    case CLOSED = 'closed';

    public static function toArray(): array
    {
        return [
            self::OPEN->value,
            self::IN_PROGRESS->value,
            self::ON_HOLD->value,
            self::RESOLVED->value,
            self::CLOSED->value,
        ];
    }
}
