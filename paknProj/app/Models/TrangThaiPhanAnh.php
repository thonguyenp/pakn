<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrangThaiPhanAnh extends Model
{
    protected $table = 'trangthaiphananh';

    protected $primaryKey = 'IdTrangThaiPhanAnh';

    public $timestamps = false;

    protected $fillable = [
        'TenTrangThai',
        'MoTa'
    ];
}