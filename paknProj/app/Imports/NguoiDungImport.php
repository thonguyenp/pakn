<?php

namespace App\Imports;

use App\Models\NguoiDung;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Collection;
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

            NguoiDung::create([
                'HoTen' => $row[0],
                'Email' => $row[1],
                'SoDienThoai' => $row[2],
                'MaSo' => $row[3],
                'MatKhau' => Hash::make('123456'),
                'TrangThai' => 1,
                'NgayTao' => now(),
                'IdDonVi' => $row[4],
            ]);
        }
    }
}