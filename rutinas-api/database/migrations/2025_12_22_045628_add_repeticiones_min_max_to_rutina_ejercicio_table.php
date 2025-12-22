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
    $table->integer('repeticiones_min')->after('series');
    $table->integer('repeticiones_max')->after('repeticiones_min');
    $table->dropColumn('repeticiones');
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rutina_ejercicio', function (Blueprint $table) {
            //
        });
    }
};
