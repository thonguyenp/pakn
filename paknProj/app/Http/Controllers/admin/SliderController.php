<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

class SliderController extends Controller
{
    /**
     * GET /api/sliders
     */
    public function index()
    {
        $sliders = Slider::orderByDesc('IdSlider')
            ->get();

        return response()->json([
            'message' => 'Lấy danh sách slider thành công',
            'data' => $sliders,
        ]);
    }

    public function publicIndex()
    {
        $now = Carbon::now();

        $sliders = Slider::where('TrangThai', 1)

            ->where(function ($query) use ($now) {
                $query->whereNull('NgayBatDau')
                    ->orWhere('NgayBatDau', '<=', $now);
            })

            ->where(function ($query) use ($now) {
                $query->whereNull('NgayKetThuc')
                    ->orWhere('NgayKetThuc', '>=', $now);
            })

            ->orderBy('ThuTu')
            ->get();

        return response()->json([
            'message' => 'Lấy slider thành công',
            'data' => $sliders,
        ]);
    }

    /**
     * POST /api/admin/sliders
     */
    public function store(Request $request)
    {
        $request->validate([
            'TieuDe' => 'nullable|string|max:255',
            'MoTa' => 'nullable|string',

            // upload file
            'Anh' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',

            'Link' => 'nullable|string|max:500',
            'ThuTu' => 'nullable|integer',
            'NgayBatDau' => 'nullable|date',
            'NgayKetThuc' => 'nullable|date|after_or_equal:NgayBatDau',
        ]);

        // upload ảnh
        $path = $request->file('Anh')
            ->store('sliders', 'public');

        $slider = Slider::create([
            'TieuDe' => $request->TieuDe,
            'MoTa' => $request->MoTa,

            // lưu path
            'Anh' => '/storage/'.$path,

            'Link' => $request->Link,
            'ThuTu' => $request->ThuTu ?? 0,
            'TrangThai' => 1,
            'NgayBatDau' => $request->NgayBatDau,
            'NgayKetThuc' => $request->NgayKetThuc,
        ]);

        return response()->json([
            'message' => 'Tạo slider thành công',
            'data' => $slider,
        ], 201);
    }

    /**
     * PUT /api/admin/sliders/{id}
     */
    public function update(Request $request, $id)
    {
        $slider = Slider::findOrFail($id);

        $request->validate([
            'TieuDe' => 'nullable|string|max:255',
            'MoTa' => 'nullable|string',

            // optional image
            'Anh' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',

            'Link' => 'nullable|string|max:500',
            'ThuTu' => 'nullable|integer',
            'TrangThai' => 'nullable|integer|in:0,1',
            'NgayBatDau' => 'nullable|date',
            'NgayKetThuc' => 'nullable|date|after_or_equal:NgayBatDau',
        ]);

        $imagePath = $slider->Anh;

        // nếu upload ảnh mới
        if ($request->hasFile('Anh')) {

            // xóa ảnh cũ
            if ($slider->Anh) {

                $oldPath = str_replace('/storage/', '', $slider->Anh);

                Storage::disk('public')->delete($oldPath);
            }

            // upload ảnh mới
            $newPath = $request->file('Anh')
                ->store('sliders', 'public');

            $imagePath = '/storage/'.$newPath;
        }

        $slider->update([
            'TieuDe' => $request->TieuDe ?? $slider->TieuDe,
            'MoTa' => $request->MoTa ?? $slider->MoTa,
            'Anh' => $imagePath,
            'Link' => $request->Link ?? $slider->Link,
            'ThuTu' => $request->ThuTu ?? $slider->ThuTu,
            'TrangThai' => $request->TrangThai ?? $slider->TrangThai,
            'NgayBatDau' => $request->NgayBatDau ?? $slider->NgayBatDau,
            'NgayKetThuc' => $request->NgayKetThuc ?? $slider->NgayKetThuc,
        ]);

        return response()->json([
            'message' => 'Cập nhật slider thành công',
            'data' => $slider,
        ]);
    }

    /**
     * DELETE /api/admin/sliders/{id}
     */
    public function destroy($id)
    {
        $slider = Slider::findOrFail($id);

        $slider->update([
            'TrangThai' => 0,
        ]);

        return response()->json([
            'message' => 'Ẩn slider thành công',
        ]);
    }
}
