export interface LoginPayload {
  Email: string;
  MatKhau: string;
}

export interface RegisterPayload {
  HoTen: string;
  Email: string;
  MatKhau: string;
  MaSo?: string;
  SoDienThoai?: string;
}

export interface AuthResponse {
  token: string;
}