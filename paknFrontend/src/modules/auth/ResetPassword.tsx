import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { resetPassword } from '@/api/authApi';

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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl mb-6">Đặt lại mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 border rounded mb-4"
          required
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Mật khẩu mới"
          className="w-full p-3 border rounded mb-4"
          required
        />
        <input
          type="password"
          value={password_confirmation}
          onChange={e => setPasswordConfirmation(e.target.value)}
          placeholder="Nhập lại mật khẩu"
          className="w-full p-3 border rounded mb-4"
          required
        />
        <button type="submit" className="w-full bg-green-600 text-white p-3 rounded">
          Cập nhật mật khẩu
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}