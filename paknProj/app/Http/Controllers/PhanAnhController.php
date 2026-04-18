<?php

namespace App\Http\Controllers;

use App\Jobs\UploadFilePhanAnhJob;
use App\Models\PhanAnh;
use App\Notifications\PhanAnhCreatedNotification;
use App\Services\PhanAnhService;
use App\Services\ThongBaoService;
use App\States\PhanAnh\BoSungThongTinUserState;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class PhanAnhController extends Controller
{
    // inject service để tái sử dụng logic xử lý trạng thái phản ánh
    protected $phanAnhService;

    protected $thongBaoService;

    public function __construct(PhanAnhService $phanAnhService, ThongBaoService $thongBaoService)
    {
        $this->phanAnhService = $phanAnhService;
        $this->thongBaoService = $thongBaoService;
    }

    public function store(Request $request)
    {
        $request->validate([
            'TieuDe' => 'required|max:300',
            'NoiDung' => 'required',
            'IdLinhVuc' => 'required',
            'IdDonVi' => 'required',
            'email' => 'nullable|email',
            'files' => 'array|max:5',
            'files.*' => 'file|max:10240',
        ]);

        DB::beginTransaction();

        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (\Exception $e) {
            $user = null;
        }

        try {
            // Tạo mã theo dõi
            do {
                $maTheoDoi = strtoupper(Str::random(12));
            } while (PhanAnh::where('MaTheoDoi', $maTheoDoi)->exists());

            $phanAnh = PhanAnh::create([
                'TieuDe' => $request->TieuDe,
                'NoiDung' => $request->NoiDung,
                'MucDoKhanCap' => $request->MucDoKhanCap ?? 'THAP',
                'AnDanh' => $request->AnDanh ?? 0,
                'NgayGui' => now(),
                'IdNguoiDung' => $user ? $user->IdNguoiDung : null,
                'IdLinhVuc' => $request->IdLinhVuc,
                'IdDonVi' => $request->IdDonVi,
                'IdTrangThaiPhanAnh' => 1,
                'MaTheoDoi' => $maTheoDoi,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['error' => 'Không thể tạo phản ánh'], 500);
        }

        $tempFiles = [];

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {

                $tempPath = $file->store('temp', 'public');

                $tempFiles[] = [
                    'temp_path' => $tempPath,
                    'original_name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                ];
            }
        }

        // Dispatch job (CHỈ 1 LẦN)
        if (! empty($tempFiles)) {
            UploadFilePhanAnhJob::dispatch($phanAnh->IdPhanAnh, $tempFiles)
                ->onQueue('uploads');
        }
        // Gửi thông báo nếu có email
        Notification::route('mail', $request->email)
            ->notify(new PhanAnhCreatedNotification($maTheoDoi));
        // tạo thông báo trong hệ thống
        $this->thongBaoService->create([
            'TieuDe' => 'Phản ánh đã được gửi',
            'NoiDung' => 'Phản ánh của bạn đã được gửi thành công: '.$phanAnh->MaTheoDoi,
            'IdNguoiDung' => $phanAnh->IdNguoiDung,
            'Loai' => 'PHAN_ANH_MOI',
            'Link' => [
                'url' => '/phan-anh/'.$phanAnh->MaTheoDoi,
            ],
        ]);

        DB::commit();

        return response()->json([
            'message' => 'Gửi phản ánh thành công'.(! empty($tempFiles) ? ' (file đang xử lý nền)' : ''),
            'data' => $phanAnh,
            'maTheoDoi' => $maTheoDoi,
        ], 200);
    }

    private function buildQuery(Request $request, $field, $value)
    {
        return PhanAnh::where($field, $value)
            ->when($request->MucDoKhanCap, function ($query) use ($request) {
                $query->where('MucDoKhanCap', $request->MucDoKhanCap);
            })
            ->when($request->IdTrangThaiPhanAnh, function ($query) use ($request) {
                $query->where('IdTrangThaiPhanAnh', $request->IdTrangThaiPhanAnh);
            })
            ->when($request->AnDanh !== null, function ($query) use ($request) {
                $query->where('AnDanh', $request->AnDanh);
            })
            ->with('files')
            ->orderBy('NgayGui', 'desc');
    }

    public function getByNguoiDung(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $phanAnhs = $this
            ->buildQuery($request, 'IdNguoiDung', $user->IdNguoiDung)
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $phanAnhs,
        ]);
    }

    public function getByDonVi(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $phanAnhs = $this
            ->buildQuery($request, 'IdDonVi', $user->IdDonVi)
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $phanAnhs,
        ]);
    }

    public function traCuu(Request $request)
    {
        // Validate
        $request->validate([
            'maTheoDoi' => 'required|string|size:12',
            'ngayGui' => 'required|date',
        ]);

        $maTheoDoi = $request->query('maTheoDoi');
        $ngayGui = $request->query('ngayGui');

        // Tìm đúng 1 record
        $phanAnh = PhanAnh::with([
            'linhVuc',
            'donVi',
            'trangThaiPhanAnh',
            'files',
            'phanHoi',
        ])
            ->where('MaTheoDoi', $maTheoDoi)
            ->whereDate('NgayGui', $ngayGui)
            ->first();

        if (! $phanAnh) {
            return response()->json([
                'message' => 'Không tìm thấy phản ánh',
            ], 404);
        }

        return response()->json([
            'data' => $phanAnh,
        ]);
    }

    public function capNhat(Request $request)
    {
        $request->validate([
            'maTheoDoi' => 'required|string|size:12',
            'ngayGui' => 'required|date',
            'NoiDung' => 'required|string',
            'files.*' => 'file|max:10240',
        ]);

        $state = app(BoSungThongTinUserState::class);

        $result = $state->handle(
            $request->maTheoDoi,
            $request->all(),
            $request->file('files')
        );

        return response()->json([
            'message' => 'Bổ sung thành công',
            'data' => $result,
        ]);
    }

    public function show($maTheoDoi)
    {
        // Chỉ lấy phản ánh nếu user là người tạo hoặc thuộc đơn vị được giao
        $user = JWTAuth::parseToken()->authenticate();

        $phanAnh = PhanAnh::with(['files', 'linhVuc', 'donVi', 'trangThaiPhanAnh',
            'phanHoi.files', 'phanHoi.nguoiDung', 'phanHoi.nguoiDung.donVi'])
            ->where('MaTheoDoi', $maTheoDoi)
            ->where(function ($query) use ($user) {
                $query->where('IdNguoiDung', $user->IdNguoiDung)
                    ->orWhere('IdDonVi', $user->IdDonVi);
            })
            ->first();

        if (! $phanAnh) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy phản ánh',
            ], 404);
        }

        foreach ($phanAnh->files as $file) {
            $file->url = asset('storage/'.$file->DuongDan);
        }

        foreach ($phanAnh->phanHoi as $phanHoi) {
            foreach ($phanHoi->files as $file) {
                $file->url = asset('storage/'.$file->DuongDan);
            }
        }

        return response()->json([
            'success' => true,
            'data' => $phanAnh,
        ]);
    }

    public function action(Request $request, $maTheoDoi)
    {
        $request->validate([
            'NoiDung' => 'required|string',
            'action' => 'required|integer',
            'files.*' => 'file|max:10240',
        ]);

        try {
            $result = $this->phanAnhService->handleAction(
                $maTheoDoi,
                $request->all(),
                $request->file('files') ?? []
            );

            return response()->json([
                'message' => 'Thực hiện thành công',
                'data' => $result,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
