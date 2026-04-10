import { type LoginPayload, type RegisterPayload, type AuthResponse } from '@/types/auth';
import { api } from '../api';
import { jwtDecode } from "jwt-decode";

export const guestLogin = async () => {
    const res = await api.post<AuthResponse>("/login/guest");
    return res.data;
};

export const login = async (data: LoginPayload): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/login', data);
  return res.data;
};

export const register = async (data: RegisterPayload): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/register', data);
  return res.data;
};

export const verifyEmail = async (token: string) => {
  const res = await api.get('/verify-email', {
    params: { token }
  });
  return res.data;
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const sendResetLink = async (email: string) => {
  const res = await api.post('/password/email', {
    Email: email,
  });
  return res.data;
};

export const resetPassword = async (data: {
  Email: string;
  token: string;
  MatKhau: string;
  MatKhau_confirmation: string;
}) => {
  const res = await api.post('/password/reset', data);
  return res.data;
};


export const parseUserFromToken = (token: string) => {
    try {
        const decoded: any = jwtDecode(token);

        if (decoded.type === "guest") {
            return {
                HoTen: "Khách"
            };
        }

        return {
            HoTen: decoded.name || "User"
        };
    } catch {
        return null;
    }
};