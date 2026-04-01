<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PhanHoi extends Model
{
    protected $table = 'phanhoi';

    protected $primaryKey = 'IdPhanHoi';

    public $timestamps = false;

    protected $fillable = [
        'NoiDung',
        'LaNoiBo',
        'NgayPhanHoi',
        'IdPhanAnh',
        'IdNguoiDung'
    ];

    // Quan hệ
    public function files()
    {
        return $this->hasMany(FileDinhKem::class, 'IdPhanHoi');
    }
}