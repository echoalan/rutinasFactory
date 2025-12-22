<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ejercicio extends Model
{

    protected $fillable = [
        'nombre',
        'descripcion',
        'grupo_muscular',
        'imagen_url',
    ];

    public function rutinas()
    {
        return $this->belongsToMany(Rutina::class)
            ->withPivot([
                'series',
                'repeticiones',
                'peso',
                'descanso_segundos',
                'orden'
            ])
            ->withTimestamps();
    }

}
