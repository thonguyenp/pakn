<?php

namespace App\States\PhanAnh;

use App\Models\LichSuXuLy;
use App\Models\NguoiDung;
use App\Models\PhanAnh;
use App\Services\ThongBaoService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TiepNhanState extends BasePhanAnhState
{
    protected $thongBaoService;

    public function __construct(ThongBaoService $thongBaoService)
    {
        $this->thongBaoService = $thongBaoService;
    }

    public function handle($maTheoDoi, $data = [], $files = [])
    {
        $phanAnh = DB::transaction(function () use ($maTheoDoi) {

            $phanAnh = PhanAnh::where('MaTheoDoi', $maTheoDoi)
                ->firstOrFail();

            // validate transition
            if (! in_array(2, $this->allowedTransitions($phanAnh->IdTrangThaiPhanAnh))) {
                throw new \Exception('Không thể chuyển sang trạng thái tiếp nhận');
            }

            // cập nhật trạng thái
            $phanAnh->update([
                'IdTrangThaiPhanAnh' => 2,
                'NgayCapNhat' => now(),
            ]);

            // lưu lịch sử xử lý
            LichSuXuLy::create([
                'HanhDong' => 'Tiếp nhận phản ánh',
                'GhiChu' => 'Phản ánh đã được tiếp nhận',
                'ThoiGian' => now(),
                'IdPhanAnh' => $phanAnh->IdPhanAnh,
                'IdNguoiDung' => Auth::id(),
            ]);

            return $phanAnh;
        });

        // gửi thông báo cho người gửi phản ánh
        if ($phanAnh->IdNguoiDung) {

            $this->thongBaoService->create([
                'TieuDe' => 'Phản ánh đã được tiếp nhận',
                'NoiDung' => 'Phản ánh của bạn đã được tiếp nhận. Mã theo dõi: '.$phanAnh->MaTheoDoi,
                'IdNguoiDung' => $phanAnh->IdNguoiDung,
                'Loai' => 'PHAN_ANH_TIEP_NHAN',
                'Link' => [
                    'url' => '/phan-anh/'.$phanAnh->MaTheoDoi,
                ],
            ]);
        }
        // gửi thông báo cho người cùng đơn vị xử lý
        $nguoiDungDonVi = NguoiDung::where('IdDonVi', $phanAnh->IdDonVi)
            ->where('TrangThai', 1)
            ->get();

        foreach ($nguoiDungDonVi as $nguoiNhan) {

            // tránh gửi lại cho chính người tạo
            if ($nguoiNhan->IdNguoiDung == $phanAnh->IdNguoiDung) {
                continue;
            }

            $this->thongBaoService->create([
                'TieuDe' => 'Có phản ánh mới',
                'NoiDung' => 'Có phản ánh mới cần xử lý: '.$phanAnh->TieuDe,
                'IdNguoiDung' => $nguoiNhan->IdNguoiDung,
                'Loai' => 'PHAN_ANH_MOI_DON_VI',
                'Link' => [
                    'url' => '/phan-anh/'.$phanAnh->MaTheoDoi,
                ],
            ]);
        }

        return [
            'message' => 'Tiếp nhận phản ánh thành công',
            'phanAnh' => $phanAnh,
        ];
    }
}
