<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('candidate_segment_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pageant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('segment_id')->constrained()->cascadeOnDelete();
            $table->foreignId('candidate_id')->constrained()->cascadeOnDelete();
            $table->decimal('total_score', 8, 2)->default(0);
            $table->decimal('average_score', 5, 2)->default(0);
            $table->timestamps();
            $table->unique(['segment_id', 'candidate_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('candidate_segment_scores');
    }
};
