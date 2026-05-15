<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\LichSuXuLy;
use Illuminate\Http\Request;

class LichSuXuLyController extends Controller
{
    public function index(Request $request)
    {
        $query = LichSuXuLy::with([
            'nguoiDung',
            'phanAnh',
        ]);

        // =========================
        // FILTER THEO LOAI
        // =========================
        if ($request->filled('Loai')) {

            $query->where('Loai', $request->Loai);
        }

        // =========================
        // FILTER FROM DATE
        // =========================
        if ($request->filled('from')) {

            $query->whereDate(
                'ThoiGian',
                '>=',
                $request->from
            );
        }

        // =========================
        // FILTER TO DATE
        // =========================
        if ($request->filled('to')) {

            $query->whereDate(
                'ThoiGian',
                '<=',
                $request->to
            );
        }

        // =========================
        // SEARCH
        // =========================
        if ($request->filled('search')) {

            $search = $request->search;

            $query->where(function ($q) use ($search) {

                $q->where('HanhDong', 'like', "%{$search}%")
                    ->orWhere('GhiChu', 'like', "%{$search}%")

                    // tìm theo tên người dùng
                    ->orWhereHas('nguoiDung', function ($sub) use ($search) {

                        $sub->where(
                            'HoTen',
                            'like',
                            "%{$search}%"
                        );
                    });
            });
        }

        // =========================
        // ORDER + PAGINATE
        // =========================
        $data = $query
            ->orderByDesc('ThoiGian')
            ->paginate(20)
            ->appends($request->query());

        return response()->json($data);
    }
}