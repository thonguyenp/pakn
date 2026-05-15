import { useEffect, useState } from 'react';
import RegisterForm from '@/modules/auth/RegisterForm';
import { resendVerifyEmail } from '@/api/user/authApi';

export default function RegisterPage() {

  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loadingResend, setLoadingResend] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleRegisterSuccess = (userEmail: string) => {
    setEmail(userEmail);
    setSuccess(true);
    setCountdown(60); // bắt đầu đếm ngược 60 giây
    setMessage('Email đã được gửi. Vui lòng kiểm tra hộp thư của bạn.');
  };
  useEffect(() => {

    if (countdown <= 0) return;

    const timer = setInterval(() => {

      setCountdown(prev => {

        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });

    }, 1000);

    return () => clearInterval(timer);

  }, [countdown]);
  const handleResendEmail = async () => {

    try {

      setLoadingResend(true);

      const res = await resendVerifyEmail(email);

      setMessage(res.message);

    } catch (err: any) {

      const remaining = Math.floor(err.response?.data?.remaining);

      if (remaining) {

        setCountdown(remaining);

      }

      setMessage(
        err.response?.data?.message ||
        'Gửi email thất bại'
      );

    } finally {

      setLoadingResend(false);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">

      <img
        src="/images/background_login.jpg"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
      />

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Đăng ký tài khoản
        </h2>

        {success ? (

          <div className="space-y-4 text-center">

            <p className="text-green-600 font-medium">
              Đăng ký thành công!
            </p>

            <p className="text-gray-700">
              Vui lòng kiểm tra email để xác thực tài khoản.
            </p>

            <button
              onClick={handleResendEmail}
              disabled={loadingResend || countdown > 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded-lg"
            >
              {loadingResend
                ? 'Đang gửi...'
                : countdown > 0
                  ? `Gửi lại sau ${countdown}s`
                  : 'Gửi lại email xác thực'}
            </button>

            {message && (
              <p className="text-sm text-gray-700">
                {message}
              </p>
            )}

          </div>

        ) : (

          <RegisterForm onSuccess={handleRegisterSuccess} />

        )}

        <p className="mt-4 text-center text-sm">
          Đã có tài khoản?{' '}
          <a
            href="/login"
            className="text-blue-600 hover:underline"
          >
            Đăng nhập
          </a>
        </p>

      </div>
    </div>
  );
}