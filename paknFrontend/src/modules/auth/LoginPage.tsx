import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import { guestLogin, setAuthToken } from '@/api/user/authApi';
import AuthLayout from '@/layouts/AuthLayout';

export default function LoginPage() {
  const navigate = useNavigate();
  const handleGuestLogin = async () => {
    try {
      const res = await guestLogin();

      // lưu token
      localStorage.setItem("token", res.token);
      setAuthToken(res.token);

      // QUAN TRỌNG: fake user cho guest
      localStorage.setItem(
        "user",
        JSON.stringify({
          HoTen: "Khách",
          isGuest: true
        })
      );

      // guest không có quyền
      localStorage.setItem("permissions", JSON.stringify([]));

      // reload hoặc redirect
      navigate("/");
    } catch (err) {
      console.error("Guest login failed", err);
    }
  };
  const handleLoginSuccess = (data: any) => {

    localStorage.setItem('token', data.token)

    localStorage.setItem(
      'permissions',
      JSON.stringify(data.permissions)
    )
    localStorage.setItem(
      'user',
      JSON.stringify(data.user)
    )

    setAuthToken(data.token)

    navigate('/')
  };
  return (
    <AuthLayout title="Đăng nhập">
      <LoginForm onSuccess={handleLoginSuccess} onGuestLogin={handleGuestLogin} />
      <p className="mt-6 text-center text-gray-600">
        Chưa có tài khoản?{' '}
        <a href="/register" className="text-cyan-600 hover:text-cyan-700 font-medium">
          Đăng ký
        </a>
      </p>
    </AuthLayout>
  );
}