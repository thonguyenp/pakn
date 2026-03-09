import { useState } from 'react';
import { sendResetLink } from '@/api/authApi';

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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl mb-6">Quên mật khẩu</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email của bạn"
          className="w-full p-3 border rounded mb-4"
          required
        />

        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded">
          Gửi link đặt lại
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}