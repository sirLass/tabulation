<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('candidates', function (Blueprint $table) {
            $table->string('gender')->nullable()->after('email');
            $table->string('primary_image')->nullable()->after('gender');
            $table->string('hover_image')->nullable()->after('primary_image');
        });
    }

    public function down(): void
    {
        Schema::table('candidates', function (Blueprint $table) {
            $table->dropColumn(['gender', 'primary_image', 'hover_image']);
        });
    }
};
