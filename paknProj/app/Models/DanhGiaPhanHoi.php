<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DanhGiaPhanHoi extends Model
{
    //
    protected $table = 'danhgiaphanhoi';

    protected $primaryKey = 'IdDanhGiaPhanHoi';

    public $timestamps = false;

    protected $fillable = [
        'MucDoHaiLong',
        'NhanXet',
        'ThoiGian',
        'IdPhanHoi',
        'IdNguoiDung',
    ];

    // Quan hệ
    public function phanHoi()
    {
        return $this->belongsTo(PhanHoi::class, 'IdPhanHoi');
    }

    public function nguoiDung()
    {
        return $this->belongsTo(NguoiDung::class, 'IdNguoiDung');
    }
}
