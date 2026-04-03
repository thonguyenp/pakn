<?php

namespace App\Http\Controllers;

use App\Jobs\UploadFilePhanHoiJob;
use App\Models\PhanHoi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PhanHoiController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'NoiDung' => 'required|string',
            'IdPhanAnh' => 'required|exists:phananh,IdPhanAnh',
            'LaNoiBo' => 'nullable|boolean',
            'IdNguoiDung' => 'nullable|integer',
            'files' => 'array|max:5',
            'files.*' => 'file|max:10240', // tối đa 10MB mỗi file
        ]);

        DB::beginTransaction();

        try {
            $phanHoi = PhanHoi::create([
                'NoiDung' => $request->NoiDung,
                'LaNoiBo' => $request->LaNoiBo ?? 0,
                'NgayPhanHoi' => now(),
                'IdPhanAnh' => $request->IdPhanAnh,
                'IdNguoiDung' => $request->IdNguoiDung ?? null,
            ]);

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Tạo PhanHoi thất bại', ['error' => $e->getMessage()]);

            return response()->json(['error' => 'Không thể tạo phản hồi'], 500);
        }

        // === Xử lý file trực tiếp (không temp) ===
        $tempFiles = [];

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {

                $tempPath = $file->store('temp', 'public');

                $tempFiles[] = [
                    'temp_path' => $tempPath,
                    'original_name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                ];
            }
        }
        // Dispatch job chỉ để lưu thông tin file vào database
        if (! empty($tempFiles)) {
            UploadFilePhanHoiJob::dispatch($phanHoi->IdPhanHoi, $tempFiles)
                ->onQueue('uploads');
        }

        return response()->json([
            'message' => 'Tạo phản hồi thành công'.(! empty($tempFiles) ? ' (file đang xử lý nền)' : ''),
            'data' => $phanHoi,
        ]);
    }
}
