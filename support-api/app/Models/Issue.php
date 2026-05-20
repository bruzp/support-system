<?php

namespace App\Models;

use App\Enums\Issue\Category;
use App\Enums\Issue\Priority;
use App\Enums\Issue\Status;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $id
 * @property int|null $user_id
 * @property string $title
 * @property string $description
 * @property 'low'|'medium'|'high'|'critical' $priority
 * @property 'bug'|'feature_request'|'infrastructure'|'security'|'billing'|'general' $category
 * @property 'open'|'in_progress'|'on_hold'|'resolved'|'closed' $status
 * @property bool $is_escalated
 * @property \Carbon\Carbon|null $escalated_at
 * @property \Carbon\Carbon|null $acknowledged_at
 * @property \Carbon\Carbon|null $resolved_at
 * @property \Carbon\Carbon|null $due_at
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property IssueAiResult $summary
 */
#[Fillable(['user_id', 'title', 'description', 'priority', 'category', 'status', 'is_escalated', 'escalated_at', 'acknowledged_at', 'resolved_at', 'due_at'])]
class Issue extends Model
{
    protected $casts = [
        'escalated_at' => 'datetime',
        'acknowledged_at' => 'datetime',
        'resolved_at' => 'datetime',
        'due_at' => 'datetime',
        'priority' => Priority::class,
        'category' => Category::class,
        'status' => Status::class,
    ];

    public function summary(): HasOne
    {
        return $this->hasOne(IssueAiResult::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
