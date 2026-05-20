<?php

namespace App\Enums\Issue;

enum Category: string
{
    case BUG = 'bug';
    case FEATURE_REQUEST = 'feature_request';
    case INFRASTRUCTURE = 'infrastructure';
    case SECURITY = 'security';
    case BILLING = 'billing';
    case GENERAL = 'general';

    public static function toArray(): array
    {
        return [
            self::BUG->value,
            self::FEATURE_REQUEST->value,
            self::INFRASTRUCTURE->value,
            self::SECURITY->value,
            self::BILLING->value,
            self::GENERAL->value,
        ];
    }
}
