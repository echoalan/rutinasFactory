<?php

namespace App\Http\Controllers\Api;
use App\Models\Ejercicio;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EjercicioController extends Controller
{
    public function index()
    {
        return Ejercicio::all();
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
            'descripcion' => 'nullable|string',
            'grupo_muscular' => 'required|string',
            'imagen' => 'nullable|image|max:2048',
        ]);

        $imagenUrl = null;

        if ($request->hasFile('imagen')) {
            // Guardamos solo el nombre del archivo
            $path = $request->file('imagen')->store('ejercicios', 'public');
            $imagenUrl = basename($path);
        }

        $ejercicio = Ejercicio::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'grupo_muscular' => $request->grupo_muscular,
            'imagen_url' => $imagenUrl,
        ]);

        return response()->json($ejercicio, 201);
    }

    public function show(Ejercicio $ejercicio)
    {
        return $ejercicio;
    }

    public function update(Request $request, Ejercicio $ejercicio)
    {
        $ejercicio->update($request->all());
        return $ejercicio;
    }

   public function destroy(Ejercicio $ejercicio)
{
    try {
        // Quitar relaciones
        $ejercicio->rutinas()->detach();

        // Eliminar imagen si existe
        if ($ejercicio->imagen_url) {
            $path = storage_path('app/public/ejercicios/' . $ejercicio->imagen_url);
            if (file_exists($path)) {
                unlink($path);
            }
        }

        // Eliminar el ejercicio
        $ejercicio->delete();

        return response()->json([
            'ok' => true,
            'message' => 'Ejercicio eliminado correctamente'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'ok' => false,
            'message' => $e->getMessage(), // <- Esto ayuda mucho
        ], 500);
    }
}
}
