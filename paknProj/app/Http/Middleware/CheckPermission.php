<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, $permission): Response
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        // Cache quyền của user trong 10 phút
        $permissions = Cache::remember(
            'user_permissions_' . $user->IdNguoiDung,
            600,
            function () use ($user) {
                return $user->quyens()
                    ->pluck('TenQuyen')
                    ->toArray();
            }
        );

        if (!in_array($permission, $permissions)) {
            return response()->json([
                'message' => 'Không có quyền'
            ], 403);
        }

        return $next($request);
    }
}