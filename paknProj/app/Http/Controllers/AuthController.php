<?php

namespace App\Http\Controllers;

use App\Models\NguoiDung;
use App\Notifications\VerifyEmailQueued;
use App\Services\LichSuXuLyService;
use Carbon\Carbon;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Facades\JWTFactory;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'HoTen' => 'required|string|max:200',
            'Email' => 'required|email|unique:NguoiDung,Email',
            'MatKhau' => 'required|string|min:6',
            'MaSo' => 'nullable|string|unique:NguoiDung,MaSo',
            'SoDienThoai' => 'nullable|string|max:10',
        ]);

        DB::beginTransaction();

        try {
            $user = NguoiDung::create([
                'HoTen' => $validated['HoTen'],
                'Email' => $validated['Email'],
                'MatKhau' => Hash::make($validated['MatKhau']),
                'MaSo' => $validated['MaSo'] ?? null,
                'SoDienThoai' => $validated['SoDienThoai'] ?? null,
                'TrangThai' => 1,
                'NgayTao' => now(),
            ]);

            // Gán role & quyền
            DB::table('NguoiDungVaiTro')->insert([
                'IdNguoiDung' => $user->IdNguoiDung,
                'IdVaiTro' => 1,
            ]);

            DB::table('NguoiDungQuyen')->insert([
                [
                    'IdNguoiDung' => $user->IdNguoiDung,
                    'IdQuyen' => 2,
                    'TrangThai' => 1,
                    'NgayGanQuyen' => now(),
                ],
                [
                    'IdNguoiDung' => $user->IdNguoiDung,
                    'IdQuyen' => 3,
                    'TrangThai' => 1,
                    'NgayGanQuyen' => now(),
                ],
            ]);

            $token = Str::random(60);

            DB::table('email_verifications')->insert([
                'user_id' => $user->IdNguoiDung,
                'token' => $token,
                'created_at' => now(),
            ]);

            DB::commit();   // Commit trước khi dispatch notification

            // Gửi email sau khi commit thành công
            $user->notify((new VerifyEmailQueued($token, $user->IdNguoiDung))->afterCommit());

            $jwtToken = JWTAuth::fromUser($user);

            return response()->json([
                'message' => 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực.',
                'token' => $jwtToken,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Register error: '.$e->getMessage());

            return response()->json(['message' => 'Đăng ký thất bại', 'error' => $e->getMessage()], 500);
        }
    }

    public function resendVerifyEmail(Request $request)
    {
        $request->validate([
            'Email' => 'required|email|exists:NguoiDung,Email',
        ]);

        $user = NguoiDung::where('Email', $request->Email)->first();

        $verification = DB::table('email_verifications')
            ->where('user_id', $user->IdNguoiDung)
            ->first();

        if (! $verification) {
            return response()->json([
                'message' => 'Không tìm thấy yêu cầu xác thực',
            ], 404);
        }

        // Cooldown 60 giây
        $lastSent = \Carbon\Carbon::parse($verification->created_at);

        if ($lastSent->diffInSeconds(now()) < 60) {

            $remaining = 60 - $lastSent->diffInSeconds(now());

            return response()->json([
                'message' => "Vui lòng đợi {$remaining}s để gửi lại email",
            ], 429);
        }

        $token = Str::random(60);

        DB::table('email_verifications')->updateOrInsert(
            ['user_id' => $user->IdNguoiDung],
            [
                'token' => $token,
                'created_at' => now(),
            ]
        );

        $user->notify(
            new VerifyEmailQueued($token, $user->IdNguoiDung)
        );

        return response()->json([
            'message' => 'Đã gửi lại email xác thực',
        ]);
    }

    public function verifyEmail(Request $request)
    {
        $token = $request->token;

        $record = DB::table('email_verifications')
            ->where('token', $token)
            ->first();

        if ($record) {
            // verify lần đầu
            DB::table('NguoiDung')
                ->where('IdNguoiDung', $record->user_id)
                ->update([
                    'email_verified_at' => now(),
                ]);

            DB::table('email_verifications')
                ->where('token', $token)
                ->delete();

            return response()->json(['message' => 'Xác thực thành công']);
        }

        // fallback: token không còn → check user đã verify chưa
        $user = DB::table('NguoiDung')
            ->where('email_verified_at', '!=', null)
            ->first();

        if ($user) {
            return response()->json([
                'message' => 'Email đã được xác thực trước đó',
            ], 200);
        }

        return response()->json([
            'message' => 'Token không hợp lệ hoặc đã hết hạn',
        ], 400);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'Email' => 'required|email',
            'MatKhau' => 'required|string',
        ]);

        if (! $token = JWTAuth::attempt([
            'Email' => $credentials['Email'],
            'password' => $credentials['MatKhau'],
        ])) {
            return response()->json([
                'error' => 'Thông tin đăng nhập không đúng',
            ], 401);
        }

        $user = JWTAuth::setToken($token)->authenticate();

        if (is_null($user->email_verified_at)) {
            return response()->json([
                'error' => 'Vui lòng xác thực email trước',
            ], 403);
        }

        if ($user->TrangThai !== 1) {
            JWTAuth::invalidate($token);

            return response()->json([
                'error' => 'Tài khoản bị khóa',
            ], 403);
        }

        // LẤY QUYỀN CỦA USER
        $permissions = $user->quyens()
            ->pluck('TenQuyen');
        // ghi lại lịch sử đăng nhập
        LichSuXuLyService::ghi(
            hanhDong : 'Đăng nhập',
            ghiChu : $user->HoTen.' đăng nhập vào hệ thống',
            idNguoiDung : $user->IdNguoiDung,
            loai : 'AUTH',
        );

        return response()->json([
            'token' => $token,
            'user' => $user,
            'permissions' => $permissions,
        ]);
    }

    public function logout(Request $request)
    {
        try {

            $user = Auth::user();

            // ghi lịch sử
            LichSuXuLyService::ghi(
                hanhDong: 'Đăng xuất',
                ghiChu: $user->HoTen.' đăng xuất hệ thống',
                idNguoiDung: $user->IdNguoiDung,
                loai: 'AUTH'
            );

            // invalidate token
            Auth::logout();

            return response()->json([
                'message' => 'Đăng xuất thành công',
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Logout thất bại',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function sendResetLinkEmail(Request $request)
    {
        $request->validate([
            'Email' => 'required|email|exists:NguoiDung,Email',
        ]);

        try {
            $status = Password::broker('nguoidung')->sendResetLink(
                $request->only('Email')
            );

            Log::info('Forgot password request', ['email' => $request->Email, 'status' => $status]);

            return $status === Password::RESET_LINK_SENT
                ? response()->json([
                    'message' => 'Đã gửi link đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư (và thư rác).',
                ], 200)
                : response()->json(['error' => __($status)], 400);

        } catch (\Exception $e) {
            Log::error('Forgot password error: '.$e->getMessage());

            return response()->json(['error' => 'Có lỗi xảy ra, vui lòng thử lại sau.'], 500);
        }
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'Email' => 'required|email',
            'MatKhau' => 'required|min:6|confirmed',
        ]);

        $status = Password::broker('nguoidung')->reset(
            [
                'email' => $request->Email,
                'password' => $request->MatKhau,
                'password_confirmation' => $request->MatKhau_confirmation,
                'token' => $request->token,
            ],
            function ($user, $password) {
                $user->MatKhau = Hash::make($password);
                $user->save();

                event(new PasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Đặt lại mật khẩu thành công'], 200)
            : response()->json(['error' => __($status)], 400);
    }

    public function guestLogin()
    {
        $guestId = Str::uuid()->toString();

        // Build payload với đầy đủ claim cần thiết
        $payload = JWTFactory::customClaims([
            'type' => 'guest',
            'guest_id' => $guestId,
        ])
            ->sub($guestId)                // dùng guestId làm subject tạm
            ->iat(Carbon::now()->timestamp)
            ->nbf(Carbon::now()->timestamp)
            ->exp(Carbon::now()->addDays(7)->timestamp)
            ->jti(Str::random(32))         // hoặc Str::uuid()
            ->iss(config('app.url'))       // optional, issuer
            ->make();

        $token = JWTAuth::encode($payload);

        return response()->json([
            'token' => $token->get(),
        ]);
    }
}
