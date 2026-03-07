import axios from 'axios';
import { type LoginPayload, type RegisterPayload, type AuthResponse } from '@/types/auth';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

export const login = async (data: LoginPayload): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/login', data);
  return res.data;
};

export const register = async (data: RegisterPayload): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/register', data);
  return res.data;
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};