import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import { setAuthToken } from '@/api/authApi';
import AuthLayout from '@/layouts/AuthLayout';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('token', token);
    setAuthToken(token);
    navigate('/');
  };

  return (
    <AuthLayout title="Đăng nhập">
        <LoginForm onSuccess={handleLoginSuccess} />
        <p className="mt-6 text-center text-gray-600">
          Chưa có tài khoản?{' '}
          <a href="/register" className="text-cyan-600 hover:text-cyan-700 font-medium">
            Đăng ký
          </a>
        </p>
    </AuthLayout>
  );
}