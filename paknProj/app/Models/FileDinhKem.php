<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FileDinhKem extends Model
{
    protected $table = 'filedinhkem';

    protected $primaryKey = 'IdFile';

    public $timestamps = false;

    protected $fillable = [
        'TenFile',
        'DuongDan',
        'LoaiFile',
        'KichThuoc',
        'NgayTaiLen',
        'IdPhanAnh',
        'IdPhanHoi'
    ];
}