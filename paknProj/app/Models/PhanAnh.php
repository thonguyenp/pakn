<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PhanAnh extends Model
{
    protected $table = 'phananh';

    protected $primaryKey = 'IdPhanAnh';

    public $timestamps = false;

    protected $fillable = [
        'TieuDe',
        'NoiDung',
        'MucDoKhanCap',
        'AnDanh',
        'NgayGui',
        'IdNguoiDung',
        'IdLinhVuc',
        'IdDonVi',
        'IdTrangThaiPhanAnh',
    ];

    public function files()
    {
        return $this->hasMany(FileDinhKem::class, 'IdPhanAnh', 'IdPhanAnh');
    }

    public function linhVuc()
    {
        return $this->belongsTo(LinhVuc::class, 'IdLinhVuc');
    }

    public function donVi()
    {
        return $this->belongsTo(DonVi::class, 'IdDonVi');
    }
    public function trangThaiPhanAnh()
    {
        return $this->belongsTo(TrangThaiPhanAnh::class, 'IdTrangThaiPhanAnh');
    }
}
