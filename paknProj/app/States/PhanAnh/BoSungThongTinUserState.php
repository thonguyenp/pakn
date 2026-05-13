<?php

namespace App\States\PhanAnh;

use App\Jobs\UploadFilePhanHoiJob;
use App\Models\LichSuXuLy;
use App\Models\PhanAnh;
use App\Models\PhanHoi;
use App\Services\ThongBaoService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class BoSungThongTinUserState extends BasePhanAnhState
{
    protected $thongBaoService;

    public function __construct(ThongBaoService $thongBaoService)
    {
        $this->thongBaoService = $thongBaoService;
    }

    public function handle($maTheoDoi, $data, $files = [])
    {
        // validate thêm từ ngoài:
        // $data phải có: ngayGui (để check guest đúng phản ánh)

        $phanHoi = DB::transaction(function () use ($maTheoDoi, $data) {
            $ngay = Carbon::parse($data['ngayGui'])->format('Y-m-d');

            $phanAnh = PhanAnh::where('MaTheoDoi', $maTheoDoi)
                ->whereBetween('NgayGui', [
                    $ngay.' 00:00:00',
                    $ngay.' 23:59:59',
                ])
                ->first();
            // dd($phanAnh);
            if (! $phanAnh) {
                throw new \Exception('Không tìm thấy phản ánh');
            }
            // Kiểm tra trạng thái hiện tại là 4 và được chuyển sang 3 hay không
            if (($phanAnh->IdTrangThaiPhanAnh != 4)) {
                throw new \Exception('Chỉ được bổ sung khi trạng thái = 4');
            }

            // 🎯 Tạo phản hồi (QUAN TRỌNG)
            $phanHoi = PhanHoi::create([
                'NoiDung' => $data['NoiDung'],
                'LaNoiBo' => 0, // user gửi
                'NgayPhanHoi' => now(),
                'IdPhanAnh' => $phanAnh->IdPhanAnh,
                'IdNguoiDung' => $phanAnh->IdNguoiDung ?? null, // 👈 đúng yêu cầu
            ]);

            // cập nhật phản ánh (chỉ update meta)
            $phanAnh->update([
                'NgayCapNhat' => now(),
                // có thể chuyển trạng thái nếu muốn
                'IdTrangThaiPhanAnh' => 3, // ví dụ: ĐÃ BỔ SUNG
            ]);

            // log lịch sử
            LichSuXuLy::create([
                'HanhDong' => 'Bổ sung thông tin',
                'GhiChu' => $data['NoiDung'],
                'ThoiGian' => now(),
                'IdPhanAnh' => $phanAnh->IdPhanAnh,
                'IdNguoiDung' => $phanAnh->IdNguoiDung ?? null,
            ]);

            return $phanHoi;
        });

        // 🚀 Upload file (ngoài transaction)
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

        // 🔔 Thông báo (nếu có user)
        $phanAnh = $phanHoi->phanAnh;

        if ($phanAnh->IdNguoiDung) {
            $this->thongBaoService->create([
                'TieuDe' => 'Bạn đã bổ sung thông tin',
                'NoiDung' => 'Phản ánh '.$phanAnh->MaTheoDoi.' đã được bổ sung',
                'IdNguoiDung' => $phanAnh->IdNguoiDung,
                'Loai' => 'PHAN_ANH_BO_SUNG',
                'Link' => [
                    'url' => '/phan-anh/'.$phanAnh->MaTheoDoi,
                ],
            ]);
        }

        return [
            'phanHoi' => $phanHoi,
            'hasFiles' => ! empty($tempFiles),
        ];
    }
}
