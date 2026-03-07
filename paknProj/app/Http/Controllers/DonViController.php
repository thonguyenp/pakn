<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DonVi;

class DonViController extends Controller
{
    /**
     * GET /api/donvi
     * Danh sách đơn vị (pagination)
     */
    public function index()
    {
        $data = DonVi::orderByDesc('IdDonVi')->paginate(2);

        return response()->json($data);
    }

    /**
     * POST /api/donvi
     * Tạo đơn vị mới
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'TenDonVi' => 'required|string|max:200',
            'MoTa' => 'nullable|string',
            'EmailLienHe' => 'nullable|email|max:200',
            'SoDienThoai' => 'nullable|string|max:15',
            'TrangThai' => 'required|boolean',
        ]);

        $donVi = DonVi::create([
            'TenDonVi' => $validated['TenDonVi'],
            'MoTa' => $validated['MoTa'] ?? null,
            'EmailLienHe' => $validated['EmailLienHe'] ?? null,
            'SoDienThoai' => $validated['SoDienThoai'] ?? null,
            'TrangThai' => $validated['TrangThai'],
            'NgayTao' => now(),
        ]);

        return response()->json([
            'message' => 'Tạo đơn vị thành công',
            'data' => $donVi
        ], 201);
    }

    /**
     * GET /api/donvi/{id}
     * Chi tiết đơn vị
     */
    public function show($id)
    {
        $donVi = DonVi::findOrFail($id);

        return response()->json($donVi);
    }

    /**
     * PUT /api/donvi/{id}
     * Cập nhật đơn vị
     */
    public function update(Request $request, $id)
    {
        $donVi = DonVi::findOrFail($id);

        $validated = $request->validate([
            'TenDonVi' => 'required|string|max:200',
            'MoTa' => 'nullable|string',
            'EmailLienHe' => 'nullable|email|max:200',
            'SoDienThoai' => 'nullable|string|max:15',
            'TrangThai' => 'required|boolean',
        ]);

        $donVi->update([
            'TenDonVi' => $validated['TenDonVi'],
            'MoTa' => $validated['MoTa'] ?? null,
            'EmailLienHe' => $validated['EmailLienHe'] ?? null,
            'SoDienThoai' => $validated['SoDienThoai'] ?? null,
            'TrangThai' => $validated['TrangThai'],
        ]);

        return response()->json([
            'message' => 'Cập nhật thành công',
            'data' => $donVi
        ]);
    }

    /**
     * DELETE /api/donvi/{id}
     * Xóa đơn vị
     */
    public function destroy($id)
    {
        $donVi = DonVi::findOrFail($id);
        $donVi->delete();

        return response()->json([
            'message' => 'Xóa thành công'
        ]);
    }
}