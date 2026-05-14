// Hàm tongQuan()
export interface TongQuan {
  tong_phan_anh: number
  chua_xu_ly: number
  dang_xu_ly: number
  da_hoan_thanh: number
  qua_han: number
  kip_han: number
}

export interface TheoDonVi {
  IdDonVi: number
  TenDonVi: string

  tong_phan_anh: number
  chua_xu_ly: number
  dang_xu_ly: number
  da_hoan_thanh: number

  qua_han: number
  kip_han: number
}

export type TongQuanResponse = {
  tong_quan: TongQuan
  theo_don_vi: TheoDonVi[]
}