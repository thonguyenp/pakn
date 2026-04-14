import type { FileDinhKem } from "./fileDinhKem"

export interface PhanAnh {
  IdPhanAnh: number
  TieuDe: string
  NoiDung: string
  MucDoKhanCap: string
  AnDanh: number
  NgayGui: string
  IdNguoiDung: number
  IdLinhVuc: number
  IdDonVi: number
  IdTrangThaiPhanAnh: number
  MaTheoDoi?: string
  files?: FileDinhKem[];

  linh_vuc?: {
    IdLinhVuc: number
    TenLinhVuc: string
  }
  
  trang_thai_phan_anh?: {
    IdTrangThaiPhanAnh: number
    TenTrangThai: string
  }
}