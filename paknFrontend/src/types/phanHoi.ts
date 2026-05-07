import type { User } from "./user"

export interface PhanHoi {
  IdPhanHoi: number
  NoiDung: string
  LaNoiBo: number
  NgayPhanHoi: string
  nguoi_dung?: User
}

export interface PhanHoiCreateRequest {
  NoiDung: string;
  IdPhanAnh: number;
  LaNoiBo?: boolean;
  IdNguoiDung?: number;
  files?: File[];
}

// export interface PhanHoiResponse {
//   IdPhanHoi: number;
//   NoiDung: string;
//   NgayPhanHoi: string;
//   IdPhanAnh: number;
// }

// Cập nhật phản ánh bằng cách tạo phản hồi
export interface CapNhatPhanAnhPayload {
  maTheoDoi: string
  ngayGui: string
  NoiDung: string
  files?: File[]
}
