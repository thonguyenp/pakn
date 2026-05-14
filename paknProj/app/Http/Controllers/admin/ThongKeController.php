<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\NguoiDung;
use App\Services\ThongKeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ThongKeController extends Controller
{
    public function __construct(
        protected ThongKeService $thongKeService
    ) {}

    public function thongKeDashboard ()
    {
        $thongKe = $this->thongKeService->tongQuan(null, null, false);
        return response()->json($thongKe);
    }

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
    // API filter from-to
    public function thongKeNguoiDung(Request $request)
    {
        $data = $this->thongKeService->thongKeNguoiDung(
            $request->from,
            $request->to
        );

        return response()->json($data);
    }

    // Dashboard
    public function dashboardNguoiDung()
    {
        $data = $this->thongKeService
            ->thongKeNguoiDung6ThangGanNhat();

        return response()->json([
            'theo_thang' => $data['theo_thang'],
        ]);
    }
}
