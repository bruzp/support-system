<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $issue_id
 * @property string $summary
 * @property string $suggested_action
 * @property bool $is_fallback
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
#[Fillable(['issue_id', 'summary', 'suggested_action', 'is_fallback', 'is_user_edited'])]
class IssueAiResult extends Model
{
    protected $casts = [
        'is_fallback' => 'boolean',
        'is_user_edited' => 'boolean',
    ];
}
