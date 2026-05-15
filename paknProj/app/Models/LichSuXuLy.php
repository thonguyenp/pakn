<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LichSuXuLy extends Model
{
    protected $table = 'lichsuxuly';

    protected $primaryKey = 'IdLichSuXuLy';

    public $timestamps = false; // vì bạn dùng ThoiGian riêng

    protected $fillable = [
        'HanhDong',
        'GhiChu',
        'ThoiGian',
        'IdPhanAnh',
        'IdNguoiDung',
        'Loai'
    ];

    protected $casts = [
        'ThoiGian' => 'datetime',
    ];

    // ================= RELATION =================

    // Thuộc về Phản ánh
    public function phanAnh()
    {
        return $this->belongsTo(PhanAnh::class, 'IdPhanAnh', 'IdPhanAnh');
    }

    // Thuộc về Người dùng
    public function nguoiDung()
    {
        return $this->belongsTo(NguoiDung::class, 'IdNguoiDung', 'IdNguoiDung');
    }
}