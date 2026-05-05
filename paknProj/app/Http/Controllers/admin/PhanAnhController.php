<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\LichSuXuLy;
use App\Models\PhanAnh;
use Illuminate\Http\Request;

class PhanAnhController extends Controller
{
    //
    // Lấy danh sách phản ánh
    public function index(Request $request)
    {
        $query = PhanAnh::query();

        // 1. Tìm kiếm theo tiêu đề hoặc nội dung
        if ($request->has('keyword') && $request->keyword != '') {
            $keyword = $request->keyword;

            $query->where(function ($q) use ($keyword) {
                $q->where('TieuDe', 'like', '%'.$keyword.'%')
                    ->orWhere('NoiDung', 'like', '%'.$keyword.'%');
            });
        }

        // 2. Lọc ẩn danh
        if ($request->has('AnDanh')) {
            $query->where('AnDanh', $request->AnDanh);
        }

        // 3. Lọc trạng thái
        if ($request->has('IdTrangThaiPhanAnh') && $request->IdTrangThaiPhanAnh != '') {
            $query->where('IdTrangThaiPhanAnh', $request->IdTrangThaiPhanAnh);
        }

        // 4. Lọc lĩnh vực
        if ($request->has('IdLinhVuc') && $request->IdLinhVuc != '') {
            $query->where('IdLinhVuc', $request->IdLinhVuc);
        }

        // 5. Lọc đơn vị
        if ($request->has('IdDonVi') && $request->IdDonVi != '') {
            $query->where('IdDonVi', $request->IdDonVi);
        }

        $data = $query
            ->orderByDesc('IdPhanAnh')
            ->paginate(5);

        return response()->json($data);
    }

    // Lấy chi tiết 1 phản ánh
    public function show($maTheoDoi)
    {

        $phanAnh = PhanAnh::with(['files', 'linhVuc', 'donVi', 'trangThaiPhanAnh'])
            ->where('MaTheoDoi', $maTheoDoi)->first();
        if (! $phanAnh) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy phản ánh',
            ], 404);
        }
        foreach ($phanAnh->files as $file) {
            $file->url = asset('storage/'.$file->DuongDan);
        }

        return response()->json([
            'success' => true,
            'data' => $phanAnh,
        ]);

    }

    // Xóa phản ánh
    public function destroy($maTheoDoi)
    {
        $phanAnh = PhanAnh::where('MaTheoDoi', $maTheoDoi)->first();

        if (! $phanAnh) {
            return response()->json([
                'message' => 'Không tìm thấy phản ánh',
            ], 404);
        }

        $phanAnh->delete();

        return response()->json([
            'message' => 'Xóa thành công',
        ]);
    }

    // Xem lịch sử phản ánh
    public function lichSu(Request $request, $maTheoDoi)
    {
        $perPage = $request->get('per_page', 5); // số item mỗi trang

        $lichSu = LichSuXuLy::whereHas('phanAnh', function ($query) use ($maTheoDoi) {
            $query->where('MaTheoDoi', $maTheoDoi);
        })
            ->with('nguoiDung')
            ->orderBy('ThoiGian', 'desc')
            ->paginate($perPage);

        return response()->json([
            'status' => true,
            'message' => 'Lấy lịch sử xử lý thành công',
            'data' => $lichSu->items(),
            'pagination' => [
                'current_page' => $lichSu->currentPage(),
                'last_page' => $lichSu->lastPage(),
                'per_page' => $lichSu->perPage(),
                'total' => $lichSu->total(),
            ],
        ]);
    }
}
