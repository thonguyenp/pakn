<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChuyenXuLy extends Model
{
    //
    protected $table = 'chuyenxuly';

    protected $primaryKey = 'IdChuyenXuLy';

    public $timestamps = false; // vì bạn dùng ThoiGian riêng

    protected $fillable = [
        'LyDo',
        'ThoiGian',
        'IdPhanAnh',
        'IdDonViTu',
        'IdDonViDen',
        'IdNguoiDung',
    ];
    protected $casts = [
        'ThoiGian' => 'datetime',
    ];
    // ================= RELATION =================
    // Thuộc về Phản ánh
    public function phanAnh()
    {
        return $this->belongsTo(PhanAnh::class, 'IdPhanAnh');
    }
    // Thuộc về Đơn vị từ
    public function donViTu()
    {
        return $this->belongsTo(DonVi::class, 'IdDonViTu');
    }
    // Thuộc về Đơn vị đến
    public function donViDen()
    {
        return $this->belongsTo(DonVi::class, 'IdDonViDen');
    }
    // Thuộc về Người dùng
    public function nguoiDung()
    {
        return $this->belongsTo(NguoiDung::class, 'IdNguoiDung');
    }
}
