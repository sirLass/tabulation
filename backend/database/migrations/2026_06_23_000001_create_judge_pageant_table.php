<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('judge_pageant', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('pageant_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'pageant_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('judge_pageant');
    }
};
