<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('rutina_ejercicio', function (Blueprint $table) {
            $table->integer('dia')->default(1); // por defecto día 1
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('rutina_ejercicio', function (Blueprint $table) {
            $table->dropColumn('dia');
        });
    }
};
