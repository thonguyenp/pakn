import type { DonVi } from "./donvi"

export interface User {
  IdNguoiDung: number
  HoTen: string
  Email: string
  SoDienThoai?: string
  MaSo?: string
  TrangThai: number
  NgayTao?: string
  IdDonVi?: string | null
  don_vi?: DonVi
}


export interface Permission {
  IdQuyen: number
  TenQuyen: string
  MoTa: string
}

export interface UserDetail {
  user: User
  roles: number[]
  permissions: Permission[]
  userPermissions: number[]
}