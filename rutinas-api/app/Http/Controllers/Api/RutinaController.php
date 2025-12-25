<?php

namespace App\Http\Controllers\Api;
use App\Models\Rutina;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
class RutinaController extends Controller
{
    public function index()
    {
        return Rutina::with('ejercicios')->get();
    }

    public function store(Request $request)
    {
        return Rutina::create($request->only('nombre','objetivo','nivel', 'calentamiento', 'notas'));
    }

    public function show(Rutina $rutina)
    {
        return $rutina->load([
            'ejercicios' => function ($query) {
                $query->orderBy('created_at', 'asc');
            }
        ]);
    }

    public function addEjercicio(Request $request, Rutina $rutina)
    {
        $rutina->ejercicios()->attach($request->ejercicio_id, [
            'series' => $request->series,
            'repeticiones_min' => $request->repeticiones_min,
            'repeticiones_max' => $request->repeticiones_max,
            'peso' => $request->peso,
            'orden' => $request->orden ?? 1,
            'dia' => $request->dia,
            'descanso_segundos' => $request->descanso_segundos,
            'observacion' => $request->observacion,
        ]);

        return response()->json(['ok' => true]);
    }

    public function removeEjercicio($rutina, $pivot)
    {
        $rutina = Rutina::findOrFail($rutina);

        $rutina->ejercicios()
            ->wherePivot('id', $pivot)
            ->detach();

        return response()->json(['ok' => true]);
    }

    public function destroy(Rutina $rutina)
    {
        // Eliminar relaciones en la tabla pivote
        $rutina->ejercicios()->detach();

        // Eliminar la rutina
        $rutina->delete();

        return response()->json([
            'ok' => true,
            'message' => 'Rutina eliminada correctamente'
        ]);
    }
}

