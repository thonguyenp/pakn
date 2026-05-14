<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Services\ThongKeService;
use Illuminate\Http\Request;

class ThongKeController extends Controller
{
    public function __construct(
        protected ThongKeService $thongKeService
    ) {}

    public function thongKeTongQuan(Request $request)
    {
        $validated = $request->validate([
            'from' => ['required', 'date'],
            'to' => ['required', 'date', 'after_or_equal:from'],
        ]);

        $data = $this->thongKeService->tongQuan(
            $validated['from'],
            $validated['to']
        );

        return response()->json($data);
    }
}
