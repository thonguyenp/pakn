import { useEffect, useState } from 'react';
import { login } from '@/api/user/authApi';
import { type LoginPayload } from '@/types/auth';
import { useSearchParams } from 'react-router-dom';
import PasswordInput from '@/components/shared/PasswordInput';

interface Props {
  onSuccess: (string: any) => void;
  onGuestLogin: (string: any) => void;
}

export default function LoginForm({ onSuccess, onGuestLogin }: Props) {
  const [form, setForm] = useState<LoginPayload>({ Email: '', MatKhau: '' });
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = searchParams.get('verify');

    if (verify === 'success') {
      setMessage('Email đã được xác thực thành công. Bạn có thể đăng nhập.');
    }

    if (verify === 'invalid') {
      setMessage('Link xác thực không hợp lệ.');
    }
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(form);
      onSuccess(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Đăng nhập thất bại');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className="p-3 bg-green-100 text-green-700 rounded-lg">
          {message}
        </div>
      )}
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
        <PasswordInput
          value={form.MatKhau}
          onChange={value => setForm({ ...form, MatKhau: value })}
          placeholder="Mật khẩu"
          className='w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 '
        >
        </PasswordInput>
      </div>
      <div className="flex justify-between items-center text-sm mt-2">
        <label className="flex items-center text-gray-600">
          <input type="checkbox" className="mr-2 accent-cyan-500" />
          Nhớ tài khoản
        </label>
        <a href="/forgot-password" className="text-cyan-600">
          Quên mật khẩu?
        </a>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium">
        Đăng nhập
      </button>
      <button
        type="button"
        onClick={onGuestLogin}
        className="w-full border p-3 rounded-lg font-medium hover:bg-gray-100"
      >
        Vào với tư cách khách
      </button>
    </form>
  );
}