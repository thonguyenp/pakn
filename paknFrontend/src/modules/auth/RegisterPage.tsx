import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '@/modules/auth/RegisterForm';
import { setAuthToken } from '@/api/authApi';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const handleRegisterSuccess = (token: string) => {
    localStorage.setItem('token', token);
    setAuthToken(token);
    setSuccess(true);
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <img
        src="./src/images/background_login.jpg"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng ký tài khoản</h2>

        {success ? (
          <p className="text-green-600 text-center">
            Đăng ký thành công! Đang chuyển hướng...
          </p>
        ) : (
          <RegisterForm onSuccess={handleRegisterSuccess} />
        )}

        <p className="mt-4 text-center text-sm">
          Đã có tài khoản?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
}