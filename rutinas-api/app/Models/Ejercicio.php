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
        'rutina_ejercicio' // nombre correcto de la tabla pivote
    )
    ->withPivot([
        'id',
        'series',
        'repeticiones_min',
        'repeticiones_max',
        'peso',
        'descanso_segundos',
        'orden',
        'dia'
    ])
    ->withTimestamps();
}

}
