<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ThongKeService
{
    public function tongQuan(
        $from = null,
        $to = null,
        $includeTheoDonVi = true
    ) {

        $baseQuery = DB::table('phananh')
            ->join(
                'thoihanxuly_linhvuc as thxlv',
                function ($join) {
                    $join->on(
                        'phananh.IdLinhVuc',
                        '=',
                        'thxlv.IdLinhVuc'
                    )->on(
                        'phananh.IdMucDoKhanCap',
                        '=',
                        'thxlv.IdMucDoKhanCap'
                    );
                }
            );

        // Có truyền ngày thì mới filter
        if ($from && $to) {

            $from = Carbon::parse($from)
                ->startOfDay();

            $to = Carbon::parse($to)
                ->endOfDay();

            $baseQuery->whereBetween(
                'phananh.NgayGui',
                [$from, $to]
            );
        }

        // Tổng
        $tongPhanAnh =
            (clone $baseQuery)->count();

        // Chưa xử lý
        $chuaXuLy = (clone $baseQuery)
            ->where(
                'phananh.IdTrangThaiPhanAnh',
                1
            )
            ->count();

        // Đang xử lý
        $dangXuLy = (clone $baseQuery)
            ->where(
                'phananh.IdTrangThaiPhanAnh',
                3
            )
            ->count();

        // Hoàn thành
        $daHoanThanh = (clone $baseQuery)
            ->where(
                'phananh.IdTrangThaiPhanAnh',
                6
            )
            ->count();

        // Quá hạn
        $quaHan = (clone $baseQuery)
            ->whereRaw('
            (
                (
                    phananh.NgayCapNhat IS NOT NULL
                    AND phananh.NgayCapNhat >
                    DATE_ADD(
                        phananh.NgayGui,
                        INTERVAL thxlv.SoGioXuLy HOUR
                    )
                )

                OR

                (
                    phananh.NgayCapNhat IS NULL
                    AND NOW() >
                    DATE_ADD(
                        phananh.NgayGui,
                        INTERVAL thxlv.SoGioXuLy HOUR
                    )
                )
            )
        ')
            ->distinct('phananh.IdPhanAnh')
            ->count('phananh.IdPhanAnh');

        // Kịp hạn
        $kipHan = $tongPhanAnh - $quaHan;

        $theoDonVi = [];
        // Theo đơn vị
        if ($includeTheoDonVi) {
            $theoDonVi = (clone $baseQuery)
                ->join(
                    'donvi',
                    'phananh.IdDonVi',
                    '=',
                    'donvi.IdDonVi'
                )
                ->selectRaw('
            donvi.IdDonVi,
            donvi.TenDonVi,

            COUNT(DISTINCT phananh.IdPhanAnh)
            as tong_phan_anh,

            COUNT(DISTINCT CASE
                WHEN phananh.IdTrangThaiPhanAnh = 1
                THEN phananh.IdPhanAnh
            END) as chua_xu_ly,

            COUNT(DISTINCT CASE
                WHEN phananh.IdTrangThaiPhanAnh = 3
                THEN phananh.IdPhanAnh
            END) as dang_xu_ly,

            COUNT(DISTINCT CASE
                WHEN phananh.IdTrangThaiPhanAnh = 6
                THEN phananh.IdPhanAnh
            END) as da_hoan_thanh,

            COUNT(DISTINCT CASE
                WHEN
                (
                    (
                        phananh.NgayCapNhat IS NOT NULL
                        AND phananh.NgayCapNhat >
                        DATE_ADD(
                            phananh.NgayGui,
                            INTERVAL CAST(
                                thxlv.SoGioXuLy AS SIGNED
                            ) HOUR
                        )
                    )

                    OR

                    (
                        phananh.NgayCapNhat IS NULL
                        AND NOW() >
                        DATE_ADD(
                            phananh.NgayGui,
                            INTERVAL CAST(
                                thxlv.SoGioXuLy AS SIGNED
                            ) HOUR
                        )
                    )
                )

                THEN phananh.IdPhanAnh
            END) as qua_han
            ')
                ->groupBy(
                    'donvi.IdDonVi',
                    'donvi.TenDonVi'
                )
                ->get();

            $theoDonVi = $theoDonVi->map(
                function ($item) {

                    $item->kip_han =
                        $item->tong_phan_anh -
                        $item->qua_han;

                    return $item;
                }
            );

        }

        return [
            'tong_quan' => [
                'tong_phan_anh' => $tongPhanAnh,
                'chua_xu_ly' => $chuaXuLy,
                'dang_xu_ly' => $dangXuLy,
                'da_hoan_thanh' => $daHoanThanh,
                'qua_han' => $quaHan,
                'kip_han' => $kipHan,
            ],

            'theo_don_vi' => $theoDonVi,
        ];

    }
}
