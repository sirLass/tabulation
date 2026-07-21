<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pageant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('segment_id')->constrained()->cascadeOnDelete();
            $table->foreignId('candidate_id')->constrained()->cascadeOnDelete();
            $table->foreignId('criterion_id')->constrained()->cascadeOnDelete();
            $table->integer('score')->default(0);
            $table->timestamps();

            $table->unique(['pageant_id', 'segment_id', 'candidate_id', 'criterion_id'], 'score_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scores');
    }
};
