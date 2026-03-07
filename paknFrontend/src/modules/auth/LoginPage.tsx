import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import { setAuthToken } from '@/api/authApi';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('token', token);
    setAuthToken(token);
    navigate('/'); // hoặc dashboard
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-6 text-center">Đăng nhập</h2>
        <LoginForm onSuccess={handleLoginSuccess} />
        <p className="mt-4 text-center">
          Chưa có tài khoản? <a href="/register" className="text-blue-600">Đăng ký</a>
        </p>
      </div>
    </div>
  );
}