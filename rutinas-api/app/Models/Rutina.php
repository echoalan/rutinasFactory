<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rutina extends Model
{

    protected $fillable = [
        'nombre', 'objetivo', 'nivel', 'calentamiento', 'notas'
    ];

    public function ejercicios()
    {
        return $this->belongsToMany(
            Ejercicio::class,
            'rutina_ejercicio' // 👈 nombre real de la tabla
        )
        ->withPivot([
            'id',
            'series',
            'repeticiones',
            'peso',
            'descanso_segundos',
            'orden',
            'dia'
        ])
        ->orderBy('pivot_orden');
    }

}
