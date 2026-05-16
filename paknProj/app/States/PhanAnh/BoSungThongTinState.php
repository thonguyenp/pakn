<?php

namespace App\States\PhanAnh;

use App\Jobs\UploadFilePhanHoiJob;
use App\Models\LichSuXuLy;
use App\Models\PhanAnh;
use App\Models\PhanHoi;
use App\Models\ThongBao;
use App\Services\LichSuXuLyService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BoSungThongTinState extends BasePhanAnhState
{
    public function handle($maTheoDoi, $data, $files)
    {
        $phanHoi = DB::transaction(function () use ($maTheoDoi, $data) {

            $phanAnh = PhanAnh::where('MaTheoDoi', $maTheoDoi)->firstOrFail();

            // validate transition
            if (! in_array(4, $this->allowedTransitions($phanAnh->IdTrangThaiPhanAnh))) {
                throw new \Exception('Không thể chuyển sang trạng thái bổ sung thông tin');
            }

            $phanHoi = PhanHoi::create([
                'NoiDung' => $data['NoiDung'],
                'LaNoiBo' => $data['LaNoiBo'] ?? 0,
                'NgayPhanHoi' => now(),
                'IdPhanAnh' => $phanAnh->IdPhanAnh,
                'IdNguoiDung' => Auth::id(),
            ]);

            $phanAnh->update([
                'IdTrangThaiPhanAnh' => 4,
                'NgayCapNhat' => now(),
            ]);

            LichSuXuLyService::ghi(
                hanhDong : 'Bổ sung thông tin phản ánh' . $phanAnh->MaTheoDoi,
                ghiChu : $data['NoiDung'],
                idPhanAnh : $phanAnh->IdPhanAnh,
                idNguoiDung : Auth::id(),
                loai : 'PHAN_ANH',
            );

            ThongBao::create([
                'TieuDe' => 'Phản ánh của bạn cần bổ sung thông tin',
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
}
