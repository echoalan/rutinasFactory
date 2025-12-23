<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Auth; // ✅ Importante


use Illuminate\Auth\Middleware\Authenticate as Middleware;

class AuthenticateApi
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
     public function handle(Request $request, Closure $next)
    {
        // Intentamos autenticar con el guard 'sanctum'
        if (!Auth::guard('sanctum')->check()) {
            return response()->json([
                'message' => 'No autenticado o token inválido'
            ], 401);
        }

        return $next($request);
    }
}
