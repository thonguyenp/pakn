<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
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
    public function show($id)
    {

        $phanAnh = PhanAnh::with('files')
            ->where('IdPhanAnh', $id)->first();
        if (!$phanAnh) {
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

    // Cập nhật phản ánh
    public function update(Request $request, $id)
    {
        $phanAnh = PhanAnh::find($id);

        if (! $phanAnh) {
            return response()->json([
                'message' => 'Không tìm thấy phản ánh',
            ], 404);
        }

        $phanAnh->update($request->all());

        return response()->json([
            'message' => 'Cập nhật thành công',
            'data' => $phanAnh,
        ]);
    }

    // Xóa phản ánh
    public function destroy($id)
    {
        $phanAnh = PhanAnh::find($id);

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
}
