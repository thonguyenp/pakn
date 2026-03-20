import type { FileDinhKem } from "./fileDinhKem"

export interface PhanAnh {
  IdPhanAnh: number
  TieuDe: string
  NoiDung: string
  MucDoKhanCap: number
  AnDanh: number
  NgayGui: string
  IdNguoiDung: number
  IdLinhVuc: number
  IdDonVi: number
  IdTrangThaiPhanAnh: number
  files?: FileDinhKem[];
}