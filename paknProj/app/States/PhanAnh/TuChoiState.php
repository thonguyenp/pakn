<?php

namespace App\States\PhanAnh;

use App\Jobs\UploadFilePhanHoiJob;
use App\Models\LichSuXuLy;
use App\Models\PhanAnh;
use App\Models\PhanHoi;
use App\Models\ThongBao;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TuChoiState implements PhanAnhStateInterface
{
    public function handle($maTheoDoi, $data, $files)
    {
        $phanHoi = DB::transaction(function () use ($maTheoDoi, $data) {

            $phanAnh = PhanAnh::where('MaTheoDoi', $maTheoDoi)->firstOrFail();
            // dd([
            //     'current' => $phanAnh->IdTrangThaiPhanAnh,
            //     'allowed' => $this->allowedTransitions($phanAnh->IdTrangThaiPhanAnh),
            // ]);

            // validate transition
            if (! in_array(7, $this->allowedTransitions($phanAnh->IdTrangThaiPhanAnh))) {
                throw new \Exception('Không thể chuyển sang trạng thái từ chối');
            }

            $phanHoi = PhanHoi::create([
                'NoiDung' => $data['NoiDung'],
                'LaNoiBo' => $data['LaNoiBo'] ?? 0,
                'NgayPhanHoi' => now(),
                'IdPhanAnh' => $phanAnh->IdPhanAnh,
                'IdNguoiDung' => Auth::id(),
            ]);

            $phanAnh->update([
                'IdTrangThaiPhanAnh' => 7,
                'NgayCapNhat' => now(),
            ]);

            LichSuXuLy::create([
                'HanhDong' => 'Từ chối phản ánh',
                'GhiChu' => $data['NoiDung'],
                'ThoiGian' => now(),
                'IdPhanAnh' => $phanAnh->IdPhanAnh,
                'IdNguoiDung' => Auth::id(),
            ]);

            ThongBao::create([
                'TieuDe' => 'Phản ánh của bạn đã bị từ chối',
                'NoiDung' => 'Lý do: '.$data['NoiDung'],
                'NgayGui' => now(),
                'DaDoc' => 0,
                'IdNguoiDung' => $phanAnh->IdNguoiDung,
                'Link' => [
                    'type' => 'phan_anh',
                    'maTheoDoi' => $phanAnh->MaTheoDoi,
                ],

            ]);

            return $phanHoi;
        });

        // xử lý file ngoài transaction
        $tempFiles = [];

        foreach ($files ?? [] as $file) {
            $tempPath = $file->store('temp', 'public');

            $tempFiles[] = [
                'temp_path' => $tempPath,
                'original_name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
            ];
        }

        if (! empty($tempFiles)) {
            UploadFilePhanHoiJob::dispatch($phanHoi->IdPhanHoi, $tempFiles)
                ->onQueue('uploads');
        }

        return [
            'phanHoi' => $phanHoi,
            'hasFiles' => ! empty($tempFiles),
        ];
    }

    private function allowedTransitions($current)
    {
        return [
            1 => [2, 7],
            2 => [3, 5, 7],
            3 => [6, 4],
            4 => [3],
            5 => [3],
        ][$current] ?? [];
    }
}
