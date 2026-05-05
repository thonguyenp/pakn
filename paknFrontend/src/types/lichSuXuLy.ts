export interface LichSuXuLy {
  IdLichSuXuLy: number
  HanhDong: string
  GhiChu: string
  ThoiGian: string
  nguoi_dung?: {
    IdNguoiDung: number
    HoTen: string
  }
}

export interface PhanHoi {
  IdPhanHoi: number
  NoiDung: string
  ThoiGian: string
}