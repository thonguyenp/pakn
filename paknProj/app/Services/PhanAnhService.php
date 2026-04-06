<?php

namespace App\Services;

use App\Models\PhanAnh;
use App\Models\PhanHoi;
use App\Models\LichSuXuLy;
use App\Jobs\UploadFilePhanHoiJob;
use Illuminate\Support\Facades\DB;

class PhanAnhService
{
    public function tuChoi($maTheoDoi, $data, $files = [])
    {
        // Dùng transaction nhưng KHÔNG xử lý file trong đây
        $phanHoi = DB::transaction(function () use ($maTheoDoi, $data) {

            // 1. Lấy phản ánh
            $phanAnh = PhanAnh::where('MaTheoDoi', $maTheoDoi)->firstOrFail();

            // 2. Tạo phản hồi
            $phanHoi = PhanHoi::create([
                'NoiDung' => $data['NoiDung'],
                'LaNoiBo' => $data['LaNoiBo'] ?? 0,
                'NgayPhanHoi' => now(),
                'IdPhanAnh' => $phanAnh->IdPhanAnh,
                'IdNguoiDung' => $data['IdNguoiDung'],
            ]);

            // 3. Update trạng thái
            $phanAnh->update([
                'IdTrangThaiPhanAnh' => 7,
            ]);

            // 4. Ghi log
            LichSuXuLy::create([
                'HanhDong' => 'Từ chối phản ánh',
                'GhiChu' => $data['NoiDung'],
                'ThoiGian' => now(),
                'IdPhanAnh' => $phanAnh->IdPhanAnh,
                'IdNguoiDung' => $data['IdNguoiDung'],
            ]);

            return $phanHoi;
        });

        // ================= FILE =================
        $tempFiles = [];

        if (!empty($files)) {
            foreach ($files as $file) {

                $tempPath = $file->store('temp', 'public');

                $tempFiles[] = [
                    'temp_path' => $tempPath,
                    'original_name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                ];
            }
        }

        if (!empty($tempFiles)) {
            UploadFilePhanHoiJob::dispatch($phanHoi->IdPhanHoi, $tempFiles)
                ->onQueue('uploads');
        }

        return [
            'phanHoi' => $phanHoi,
            'hasFiles' => !empty($tempFiles)
        ];
    }
}