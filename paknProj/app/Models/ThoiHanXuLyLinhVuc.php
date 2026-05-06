<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThoiHanXuLyLinhVuc extends Model
{
    protected $table = 'thoihanxuly_linhvuc';

    protected $primaryKey = 'IdThoiHanXuLyLinhVuc';

    public $timestamps = false;

    protected $fillable = [
        'IdMucDoKhanCap',
        'IdLinhVuc',
        'SoGioXuLy',
        'GhiChu',
    ];

    protected $casts = [
        'SoGioXuLy' => 'integer',
    ];

    // ========================
    // RELATIONSHIPS
    // ========================

    public function mucDoKhanCap()
    {
        return $this->belongsTo(MucDoKhanCap::class, 'IdMucDoKhanCap');
    }

    public function linhVuc()
    {
        return $this->belongsTo(LinhVuc::class, 'IdLinhVuc');
    }

    public static function getSoGio($mucDoId, $linhVucId)
    {
        return self::where('IdMucDoKhanCap', $mucDoId)
            ->where('IdLinhVuc', $linhVucId)
            ->value('SoGioXuLy');
    }
}
