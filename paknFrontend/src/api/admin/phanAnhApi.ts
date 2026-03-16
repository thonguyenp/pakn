import { type PhanAnh } from "@/types/phanAnh"
import type { Pagination } from "@/types/pagination"
import { api } from "../api"
import type { FileDinhKem } from "@/types/fileDinhKem"

export const phanAnhApi = {

  getAll: (page: number = 1) =>
    api.get<Pagination<PhanAnh>>(`/admin/phananh?page=${page}`),

  getById: (id: number) =>
    api.get<PhanAnh>(`/admin/phananh/${id}`),

  getFiles: (id: number) =>
    api.get<FileDinhKem[]>(`/admin/phananh/files/${id}`),

  create: (data: PhanAnh) =>
    api.post(`/admin/phananh`, data),

  update: (id: number, data: PhanAnh) =>
    api.put(`/admin/phananh/${id}`, data),

  delete: (id: number) =>
    api.delete(`/admin/phananh/${id}`)
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