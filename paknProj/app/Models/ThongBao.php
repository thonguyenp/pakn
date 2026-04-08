<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThongBao extends Model
{
    //
    protected $table = 'thongbao';

    protected $primaryKey = 'IdThongBao';

    public $timestamps = false;

    protected $casts = [
        'Link' => 'array',
    ];

    protected $fillable = [
        'TieuDe',
        'NoiDung',
        'DaDoc',
        'IdNguoiDung',
        'NgayTao',
        'Link',
    ];

    public function nguoiDung()
    {
        return $this->belongsTo(NguoiDung::class, 'IdNguoiDung');
    }
}
