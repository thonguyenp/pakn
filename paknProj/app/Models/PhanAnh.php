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
}
