<?php

namespace App\Http\Controllers;

use App\Models\ThongBao;
use App\Services\ThongBaoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ThongBaoController extends Controller
{
    //
    protected $service;

    public function __construct(ThongBaoService $service)
    {
        $this->service = $service;
    }

    public function store(Request $request)
    {
        $request->validate([
            'TieuDe' => 'required',
            'NoiDung' => 'required',
            'IdNguoiDung' => 'required',
            'Loai' => 'required',
        ]);

        $this->service->create($request->all());

        return response()->json([
            'message' => 'Đã gửi thông báo',
        ]);
    }

    public function index()
    {
        $userId = Auth::id();

        return ThongBao::where('IdNguoiDung', $userId)
            ->orderByDesc('NgayTao')
            ->get();
    }

    public function markAsRead($id)
    {
        $tb = ThongBao::findOrFail($id);
        $tb->update(['DaDoc' => 1]);

        return response()->json(['message' => 'Đã đọc']);
    }
}
