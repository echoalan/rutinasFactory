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
            Schema::create('rutina_ejercicio', function (Blueprint $table) {
                $table->id();
                $table->foreignId('rutina_id')->constrained()->cascadeOnDelete();
                $table->foreignId('ejercicio_id')->constrained()->cascadeOnDelete();
                $table->integer('series');
                $table->integer('repeticiones');
                $table->float('peso')->nullable();
                $table->integer('descanso_segundos')->nullable();
                $table->integer('orden');
                $table->timestamps();
            });
        }

        /**
         * Reverse the migrations.
         */
        public function down(): void
        {
            Schema::dropIfExists('rutina_ejercicio');
        }
    };
