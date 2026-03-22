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

            if ($payload->get('type') !== 'guest') {
                return response()->json(['message' => 'Token không hợp lệ'], 401);
            }

            $request->merge([
                'guest_id' => $payload->get('guest_id'),
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
