import { type PhanAnh } from "@/types/phanAnh"
import type { Pagination } from "@/types/pagination"
import { api } from "../api"
import type { FileDinhKem } from "@/types/fileDinhKem"

export const phanAnhApi = {

  getAll: (page: number = 1) =>
    api.get<Pagination<PhanAnh>>(`/admin/phananh?page=${page}`),

  getByMaTheoDoi: (maTheoDoi: string) =>
    api.get<PhanAnh>(`/admin/phananh/${maTheoDoi}`),

  getFiles: (id: number) =>
    api.get<FileDinhKem[]>(`/admin/phananh/files/${id}`),

  create: (data: PhanAnh) =>
    api.post(`/admin/phananh`, data),

  delete: (id: number) =>
    api.delete(`/admin/phananh/${id}`),

  getLichSu: (maTheoDoi: string, page: number = 1) =>
    api.get(`/admin/phananh/lichsu/${maTheoDoi}?page=${page}`),
}

export interface PhanAnhFilter {
  keyword?: string
  AnDanh?: number
  IdTrangThaiPhanAnh?: number
  IdLinhVuc?: number
  IdDonVi?: number
  page?: number
}

export const getPhanAnhList = async (
  params: PhanAnhFilter
): Promise<Pagination<PhanAnh>> => {
  const res = await api.get("admin/phananh", { params })
  return res.data
}