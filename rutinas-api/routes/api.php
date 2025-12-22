<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EjercicioController;
use App\Http\Controllers\Api\RutinaController;

Route::get('/ping', function () {
    return response()->json(['pong' => true]);
});

Route::apiResource('ejercicios', EjercicioController::class);
Route::apiResource('rutinas', RutinaController::class);

Route::post(
    'rutinas/{rutina}/ejercicios',
    [RutinaController::class, 'addEjercicio']
);


Route::delete(
    'rutinas/{rutina}/ejercicios/{ejercicio}',
    [RutinaController::class, 'removeEjercicio']
);

Route::delete('/rutinas/{rutina}', [RutinaController::class, 'destroy']);