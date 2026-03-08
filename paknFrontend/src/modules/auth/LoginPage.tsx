import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import { setAuthToken } from '@/api/authApi';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('token', token);
    setAuthToken(token);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <img
        src="./src/images/background_login.jpg"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Đăng nhập</h2>
        <LoginForm onSuccess={handleLoginSuccess} />
        <p className="mt-6 text-center text-gray-600">
          Chưa có tài khoản?{' '}
          <a href="/register" className="text-cyan-600 hover:text-cyan-700 font-medium">
            Đăng ký
          </a>
        </p>
      </div>
    </div>
  );
}