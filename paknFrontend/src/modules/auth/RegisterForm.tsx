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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.MatKhau !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp');
      return;
    }

    try {
      const { token } = await register(form);
      onSuccess(token);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Đăng ký thất bại');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <i className="fa-solid fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input type="text" placeholder="Họ tên" value={form.HoTen} onChange={e => setForm({ ...form, HoTen: e.target.value })} className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">*</span>
      </div>

      <div className="relative">
        <i className="fa-solid fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input type="email" placeholder="Email" value={form.Email} onChange={e => setForm({ ...form, Email: e.target.value })} className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">*</span>
      </div>

      <div className="relative">
        <i className="fa-solid fa-id-card absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input type="text" placeholder="Mã số sinh viên/giảng viên" value={form.MaSo || ''} onChange={e => setForm({ ...form, MaSo: e.target.value || undefined })} className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">*</span>
      </div>

      <div className="relative">
        <i className="fa-solid fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input type="tel" placeholder="Số điện thoại" value={form.SoDienThoai || ''} onChange={e => setForm({ ...form, SoDienThoai: e.target.value || undefined })} className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" required/>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">*</span>
      </div>

      <div className="relative">
        <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input type={showPassword ? 'text' : 'password'} placeholder="Mật khẩu" value={form.MatKhau} onChange={e => setForm({ ...form, MatKhau: e.target.value })} className="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
          <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
        </button>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">*</span>
      </div>

      <div className="relative">
        <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input type={showPassword ? 'text' : 'password'} placeholder="Nhập lại mật khẩu" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
          <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
        </button>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">*</span>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg font-medium">
        Đăng ký
      </button>
    </form>
  );
}