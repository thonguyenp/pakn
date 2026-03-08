import { useState } from 'react';
import { login } from '@/api/authApi';
import { type LoginPayload } from '@/types/auth';

interface Props {
  onSuccess: (token: string) => void;
}

export default function LoginForm({ onSuccess }: Props) {
  const [form, setForm] = useState<LoginPayload>({ Email: '', MatKhau: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="relative">
        <i className="fa-solid fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="email"
          placeholder="Email"
          value={form.Email}
          onChange={e => setForm({ ...form, Email: e.target.value })}
          className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          required
        />
      </div>

      <div className="relative">
        <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Mật khẩu"
          value={form.MatKhau}
          onChange={e => setForm({ ...form, MatKhau: e.target.value })}
          className="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium">
        Đăng nhập
      </button>
    </form>
  );
}