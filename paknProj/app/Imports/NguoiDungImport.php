<?php

namespace App\Imports;

use App\Models\NguoiDung;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToCollection;

class NguoiDungImport implements ToCollection
{
    public function collection(Collection $rows)
    {
        // bỏ dòng tiêu đề
        unset($rows[0]);

        foreach ($rows as $row) {

            // kiểm tra email tồn tại
            $exists = NguoiDung::where('Email', $row[1])->exists();

            if ($exists) {
                continue;
            }

            $user = NguoiDung::create([
                'HoTen' => $row[0],
                'Email' => $row[1],
                'SoDienThoai' => $row[2],
                'MaSo' => $row[3],
                'MatKhau' => Hash::make('123456'),
                'TrangThai' => 1,
                'NgayTao' => now(),
                'IdDonVi' => $row[4],
            ]);

            // gán quyền mặc định
            DB::table('NguoiDungQuyen')->insert([
                [
                    'IdNguoiDung' => $user->IdNguoiDung,
                    'IdQuyen' => 2,
                    'TrangThai' => 1,
                    'NgayGanQuyen' => now(),
                ],
                [
                    'IdNguoiDung' => $user->IdNguoiDung,
                    'IdQuyen' => 3,
                    'TrangThai' => 1,
                    'NgayGanQuyen' => now(),
                ],
            ]);
        }
    }
}
