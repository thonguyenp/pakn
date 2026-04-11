<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\SmtpSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SmtpController extends Controller
{
    /**
     * Lưu hoặc cập nhật SMTP settings (chỉ 1 record id = 1)
     */
    public function save(Request $request)
    {
        $data = $request->validate([
            'host' => 'required|string',
            'port' => 'required|integer|min:1|max:65535',
            'username' => 'required|string',
            'password' => 'required|string',
            'encryption' => 'nullable|in:tls,ssl',   // phổ biến nhất
            'from_email' => 'required|email',
            'from_name' => 'required|string|max:255',
        ]);

        $data['password'] = encrypt($data['password']);

        $smtp = SmtpSetting::updateOrCreate(
            ['id' => 1],
            $data
        );

        // Xóa cache nếu bạn có cache SMTP
        cache()->forget('smtp_settings');

        return response()->json([
            'message' => 'SMTP settings saved successfully',
            'data' => $smtp->makeHidden(['password']), // không trả password về FE
        ]);
    }

    /**
     * Lấy cấu hình SMTP hiện tại
     */
    public function get()
    {
        $smtp = SmtpSetting::first();

        if (!$smtp) {
            return response()->json(['message' => 'No SMTP configuration found'], 404);
        }
        $smtp->password = decrypt($smtp->password);

        return response()->json($smtp->makeHidden(['password']));
    }

    /**
     * Gửi email test – Đây là phần quan trọng nhất
     */
    public function sendTest(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $smtp = SmtpSetting::first();

        if (!$smtp) {
            return response()->json([
                'message' => 'SMTP chưa được cấu hình',
            ], 400);
        }
        $smtp->password = decrypt($smtp->password);
        try {
            $mailer = Mail::build([
                'transport' => 'smtp',
                'host' => $smtp->host,
                'port' => (int) $smtp->port,
                'username' => $smtp->username,
                'password' => $smtp->password,           // nếu đã encrypt thì decrypt trước
                'encryption' => $smtp->encryption,         // tls, ssl hoặc null
                'timeout' => 30,
            ]);

            // Gửi email test
            $mailer->raw('Đây là email test từ hệ thống phản ánh kiến nghị của trường đại học.', function ($message) use ($request, $smtp) {
                $message->to($request->email)
                    ->subject('Test SMTP Configuration - '.config('app.name'))
                    ->from($smtp->from_email, $smtp->from_name);
            });

            return response()->json([
                'message' => 'Email test đã được gửi thành công đến '.$request->email,
                'sent_to' => $request->email,
            ]);

        } catch (\Exception $e) {
            // Log lỗi chi tiết để debug
            Log::error('SMTP Test Failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'smtp_host' => $smtp->host,
                'port' => $smtp->port,
            ]);

            return response()->json([
                'message' => 'Gửi email test thất bại',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
