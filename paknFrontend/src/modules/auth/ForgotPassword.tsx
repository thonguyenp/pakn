// ForgotPassword.tsx
import AuthLayout from '@/layouts/AuthLayout';
import { sendResetLink } from '@/api/user/authApi';
import { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await sendResetLink(email);
      setMessage(res.message);
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Có lỗi xảy ra');
    }
  };

  return (
    <AuthLayout title="Quên mật khẩu">
      <form onSubmit={handleSubmit}>
        <div className="relative mb-3">
          <i className="fa-solid fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email của bạn"
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded">
          Gửi link đặt lại
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </AuthLayout>
  );
}