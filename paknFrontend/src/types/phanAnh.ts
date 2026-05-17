import type { FileDinhKem } from "./fileDinhKem"
import type { PhanHoi } from "./phanHoi"

export interface PhanAnh {
  IdPhanAnh: number
  TieuDe: string
  NoiDung: string
  IdMucDoKhanCap: number
  AnDanh: number
  NgayGui: string
  NgayGuiFormatted?: string
  IdNguoiDung: number
  IdLinhVuc: number
  IdDonVi: number
  IdTrangThaiPhanAnh: number
  MaTheoDoi?: string
  files?: FileDinhKem[]
  deadline?: string
  qua_han?: boolean
  phan_hoi?: PhanHoi[]

  linh_vuc?: {
    IdLinhVuc: number
    TenLinhVuc: string
  }
  don_vi?: {
    IdDonVi: number
    TenDonVi: string
  }
  trang_thai_phan_anh?: {
    IdTrangThaiPhanAnh: number
    TenTrangThai: string
  }
  nguoi_dung?: {
    IdNguoiDung: number
    HoTen: string
    Email: string
    MaSo?: string
  }
}