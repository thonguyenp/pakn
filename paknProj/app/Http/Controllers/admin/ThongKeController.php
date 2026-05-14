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
    public function thongKeNguoiDung(Request $request)
    {
        $from = $request->from;
        $to = $request->to;

        $query = NguoiDung::query();

        if ($from && $to) {
            $query->whereBetween('NgayTao', [
                $from.' 00:00:00',
                $to.' 23:59:59',
            ]);
        }

        // Tổng user
        $tongNguoiDung = (clone $query)->count();

        // User theo tháng
        $theoThang = (clone $query)
            ->select(
                DB::raw('MONTH(NgayTao) as thang'),
                DB::raw('YEAR(NgayTao) as nam'),
                DB::raw('COUNT(*) as tong')
            )
            ->groupBy('nam', 'thang')
            ->orderBy('nam')
            ->orderBy('thang')
            ->get();

        // User theo ngày
        $theoNgay = (clone $query)
            ->select(
                DB::raw('DATE(NgayTao) as ngay'),
                DB::raw('COUNT(*) as tong')
            )
            ->groupBy('ngay')
            ->orderBy('ngay')
            ->get();

        return response()->json([
            'tong_nguoi_dung' => $tongNguoiDung,
            'theo_thang' => $theoThang,
            'theo_ngay' => $theoNgay,
        ]);
    }
}
