<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EjercicioController;
use App\Http\Controllers\Api\RutinaController;
use App\Http\Controllers\Api\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);

// 🔐 Rutas protegidas
Route::middleware('auth.api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('ejercicios', EjercicioController::class);
    Route::apiResource('rutinas', RutinaController::class);

    Route::post('rutinas/{rutina}/ejercicios', [RutinaController::class, 'addEjercicio']);
    Route::delete('rutinas/{rutina}/ejercicios/{ejercicio}', [RutinaController::class, 'removeEjercicio']);
});

