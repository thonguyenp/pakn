<?php

namespace App\States\PhanAnh;

use App\Jobs\UploadFilePhanHoiJob;
use App\Models\LichSuXuLy;
use App\Models\PhanAnh;
use App\Models\PhanHoi;
use App\Services\ThongBaoService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ChuyenDonViState extends BasePhanAnhState
{
    protected $thongBaoService;

    public function __construct(ThongBaoService $thongBaoService)
    {
        $this->thongBaoService = $thongBaoService;
    }

    public function handle($maTheoDoi, $data, $files)
    {
        $phanHoi = DB::transaction(function () use ($maTheoDoi, $data) {

            $phanAnh = PhanAnh::where('MaTheoDoi', $maTheoDoi)->firstOrFail();

            // validate transition
            if (! in_array(5, $this->allowedTransitions($phanAnh->IdTrangThaiPhanAnh))) {
                throw new \Exception('Không thể chuyển sang trạng thái chuyển đơn vị');
            }

            $phanHoi = PhanHoi::create([
                'NoiDung' => $data['NoiDung'],
                'LaNoiBo' => $data['LaNoiBo'] ?? 0,
                'NgayPhanHoi' => now(),
                'IdPhanAnh' => $phanAnh->IdPhanAnh,
                'IdNguoiDung' => Auth::id(),
            ]);

            $phanAnh->update([
                'IdTrangThaiPhanAnh' => 3,
                'IdDonVi' => $data['IdDonVi'],
                'NgayCapNhat' => now(),
            ]);

            LichSuXuLy::create([
                'HanhDong' => 'Chuyển đơn vị',
                'GhiChu' => $data['NoiDung'],
                'ThoiGian' => now(),
                'IdPhanAnh' => $phanAnh->IdPhanAnh,
                'IdNguoiDung' => Auth::id(),
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
        $phanAnh = $phanHoi->phanAnh;

        $this->thongBaoService->create([
            'TieuDe' => 'Phản ánh bị từ chối',
            'NoiDung' => 'Phản ánh của bạn đã bị từ chối: '.$phanAnh->MaTheoDoi,
            'IdNguoiDung' => $phanAnh->IdNguoiDung,
            'Loai' => 'PHAN_ANH_TU_CHOI',
            'Link' => [
                'url' => '/phan-anh/'.$phanAnh->MaTheoDoi,
            ],
        ]);

        return [
            'phanHoi' => $phanHoi,
            'hasFiles' => ! empty($tempFiles),
        ];
    }
}
