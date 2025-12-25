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
        return $this->belongsToMany(
            Rutina::class,
            'rutina_ejercicio'
        )
        ->withPivot([
            'id',
            'series',
            'repeticiones_min',
            'repeticiones_max',
            'peso',
            'descanso_segundos',
            'observacion',
            'orden',
            'dia'
        ])
        ->withTimestamps();
    }
}