<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;

class GuestAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $payload = JWTAuth::parseToken()->getPayload();

            if ($payload->get('type') === 'guest') {
                $request->merge([
                    'guest_id' => $payload->get('guest_id'),
                    'auth_type' => 'guest'
                ]);
            } else {
                // user thật
                $user = JWTAuth::parseToken()->authenticate();

                $request->merge([
                    'user' => $user,
                    'auth_type' => 'user'
                ]);
            }

        } catch (\Exception $e) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
