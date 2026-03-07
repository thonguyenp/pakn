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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
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