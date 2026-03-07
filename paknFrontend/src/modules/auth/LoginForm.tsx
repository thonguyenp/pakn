import { useState } from 'react';
import { login } from '@/api/authApi';
import { type LoginPayload } from '@/types/auth';

interface Props {
  onSuccess: (token: string) => void;
}

export default function LoginForm({ onSuccess }: Props) {
  const [form, setForm] = useState<LoginPayload>({ Email: '', MatKhau: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token } = await login(form);
      onSuccess(token);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Đăng nhập thất bại');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={form.Email}
        onChange={e => setForm({ ...form, Email: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={form.MatKhau}
        onChange={e => setForm({ ...form, MatKhau: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        Đăng nhập
      </button>
    </form>
  );
}