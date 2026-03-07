import { useState } from 'react';
import { register } from '@/api/authApi';
import { type RegisterPayload } from '@/types/auth';

interface Props {
  onSuccess: (token: string) => void;
}

export default function RegisterForm({ onSuccess }: Props) {
  const [form, setForm] = useState<RegisterPayload>({
    HoTen: '',
    Email: '',
    MatKhau: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token } = await register(form);
      onSuccess(token);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Đăng ký thất bại');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Họ tên"
        value={form.HoTen}
        onChange={e => setForm({ ...form, HoTen: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />
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
      <input
        type="text"
        placeholder="Mã số (tùy chọn)"
        value={form.MaSo || ''}
        onChange={e => setForm({ ...form, MaSo: e.target.value || undefined })}
        className="w-full p-2 border rounded"
      />
      <input
        type="tel"
        placeholder="Số điện thoại (tùy chọn)"
        value={form.SoDienThoai || ''}
        onChange={e => setForm({ ...form, SoDienThoai: e.target.value || undefined })}
        className="w-full p-2 border rounded"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
        Đăng ký
      </button>
    </form>
  );
}