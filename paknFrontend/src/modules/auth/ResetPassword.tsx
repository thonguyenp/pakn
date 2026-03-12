import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { resetPassword } from '@/api/user/authApi';
import AuthLayout from '@/layouts/AuthLayout';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await resetPassword({
        Email: email,
        token: token || '',
        MatKhau: password,
        MatKhau_confirmation: password_confirmation,
      });
      setMessage(res.message);
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Có lỗi xảy ra');
    }
  };

  return (
    <AuthLayout title="Đặt lại mật khẩu">
      <form onSubmit={handleSubmit}>
        <div className="relative mb-3 ">
          <i className="fa-solid fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
        <div className="relative mb-3">
          <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mật khẩu mới"
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
        <div className="relative mb-3">
          <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="password"
            value={password_confirmation}
            onChange={e => setPasswordConfirmation(e.target.value)}
            placeholder="Nhập lại mật khẩu"
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white p-3 rounded">
          Cập nhật mật khẩu
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </AuthLayout>
  );
}