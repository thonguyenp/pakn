import LoginForm from "./LoginForm";
import { guestLogin as guestLoginApi } from "@/api/user/authApi";
import AuthLayout from "@/layouts/AuthLayout";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {

  // 🔥 lấy từ context
  const { login, guestLogin } = useAuth();

  // =========================
  // 👤 GUEST LOGIN
  // =========================
  const handleGuestLogin = async () => {
    try {
      await guestLoginApi();

      // 🔥 dùng đúng function guestLogin trong context
      guestLogin();

      window.location.href = "/"; // reload lại trang để áp dụng quyền guest
    } catch (err) {
      console.error("Guest login failed", err);
    }
  };
  // =========================
  // 🔐 LOGIN
  // =========================
  const handleLoginSuccess = (data: any) => {
    // ❌ bỏ hết localStorage + setAuthToken
    // ✅ chỉ gọi context
    login({
      token: data.token,
      user: data.user,
      permissions: data.permissions,
    });

    window.location.href = "/"; // reload lại trang để áp dụng quyền guest
  };

  return (
    <AuthLayout title="Đăng nhập">
      <LoginForm
        onSuccess={handleLoginSuccess}
        onGuestLogin={handleGuestLogin}
      />

      <p className="mt-6 text-center text-gray-600">
        Chưa có tài khoản?{" "}
        <a
          href="/register"
          className="text-cyan-600 hover:text-cyan-700 font-medium"
        >
          Đăng ký
        </a>
      </p>
    </AuthLayout>
  );
}