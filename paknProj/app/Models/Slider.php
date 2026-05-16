<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Slider extends Model
{
    protected $table = 'sliders';

    protected $primaryKey = 'IdSlider';

    protected $fillable = [
        'TieuDe',
        'MoTa',
        'Anh',
        'Link',
        'ThuTu',
        'TrangThai',
        'NgayBatDau',
        'NgayKetThuc',
    ];
}
