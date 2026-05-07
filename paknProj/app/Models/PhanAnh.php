<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class PhanAnh extends Model
{
    use Searchable;

    protected $table = 'phananh';

    protected $primaryKey = 'IdPhanAnh';

    public $timestamps = false;

    protected $fillable = [
        'TieuDe',
        'NoiDung',
        'AnDanh',
        'NgayGui',
        'NgayCapNhat',
        'IdNguoiDung',
        'IdLinhVuc',
        'IdDonVi',
        'IdMucDoKhanCap',
        'IdTrangThaiPhanAnh',
        'MaTheoDoi',
    ];

    // Tạo thuộc tính ảo để định dạng ngày gửi
    protected $appends = ['NgayGuiFormatted', 'qua_han', 'deadline'];

    protected $casts = [
        'NgayGui' => 'datetime',
    ];

    public function getNgayGuiFormattedAttribute()
    {
        return $this->NgayGui
            ? $this->NgayGui->format('d/m/Y')
            : null;
    }

    public function getScoutKey()
    {
        return $this->IdPhanAnh;
    }

    public function getScoutKeyName()
    {
        return 'IdPhanAnh';
    }

    public function files()
    {
        return $this->hasMany(FileDinhKem::class, 'IdPhanAnh', 'IdPhanAnh');
    }

    public function phanHoi()
    {
        return $this->hasMany(PhanHoi::class, 'IdPhanAnh');
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

    public function thoiHanXuLy()
    {
        return $this->hasOne(
            ThoiHanXuLyLinhVuc::class,
            'IdLinhVuc',
            'IdLinhVuc'
        )->where('IdMucDoKhanCap', $this->IdMucDoKhanCap);
    }

    public function mucDoKhanCap()
    {
        return $this->belongsTo(MucDoKhanCap::class, 'IdMucDoKhanCap');
    }

    public function toSearchableArray()
    {
        $this->loadMissing(['linhVuc', 'donVi']);

        return [
            'IdPhanAnh' => $this->IdPhanAnh,
            'tieu_de' => $this->TieuDe,
            'noi_dung' => $this->NoiDung,

            'linh_vuc' => optional($this->linhVuc)->TenLinhVuc,
            'don_vi' => optional($this->donVi)->TenDonVi,

            'id_linh_vuc' => $this->IdLinhVuc,
            'id_don_vi' => $this->IdDonVi,
            'id_trang_thai' => $this->IdTrangThaiPhanAnh,

            'ngay_gui' => $this->NgayGui,
        ];
    }

    // Logic để tính quá hạn và deadline
    public function getDeadlineAttribute()
    {
        if (! $this->IdMucDoKhanCap || ! $this->IdLinhVuc || ! $this->NgayGui) {
            return null;
        }

        $thoiHan = ThoiHanXuLyLinhVuc::where('IdMucDoKhanCap', $this->IdMucDoKhanCap)
            ->where('IdLinhVuc', $this->IdLinhVuc)
            ->first();

        if (! $thoiHan) {
            return null;
        }

        return $this->NgayGui->copy()->addHours($thoiHan->SoGioXuLy);
    }

    public function isQuaHan()
    {
        $deadline = $this->deadline;

        if (! $deadline) {
            return false;
        }

        // Nếu đã cập nhật/xử lý
        if ($this->NgayCapNhat) {
            return Carbon::parse($this->NgayCapNhat)->gt($deadline);
        }

        // Nếu chưa xử lý
        return now()->gt($deadline);
    }

    // 👇 dùng cho API
    public function getQuaHanAttribute()
    {
        return $this->isQuaHan();
    }
}
