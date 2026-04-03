export interface PhanHoiCreateRequest {
  NoiDung: string;
  IdPhanAnh: number;
  LaNoiBo?: boolean;
  IdNguoiDung?: number;
  files?: File[];
}

export interface PhanHoiResponse {
  IdPhanHoi: number;
  NoiDung: string;
  NgayPhanHoi: string;
  IdPhanAnh: number;
}