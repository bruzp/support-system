<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    public function up(): void
    {
        Schema::create('issue_ai_results', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('issue_id')->unique();
            $table->string('summary', 500);
            $table->text('suggested_action');
            $table->boolean('is_fallback')->default(false);
            $table->boolean('is_user_edited')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('issue_ai_results');
    }
};
