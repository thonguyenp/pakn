import { type PhanAnh } from "../types/phanAnh"
import type { Pagination } from "../types/pagination"
import { api } from "./api"

export const phanAnhApi = {

  getAll: (page: number = 1) =>
    api.get<Pagination<PhanAnh>>(`/admin/phananh?page=${page}`),

  getById: (id: number) =>
    api.get<PhanAnh>(`/admin/phananh/${id}`),

  create: (data: PhanAnh) =>
    api.post(`/admin/phananh`, data),

  update: (id: number, data: PhanAnh) =>
    api.put(`/admin/phananh/${id}`, data),

  delete: (id: number) =>
    api.delete(`/admin/phananh/${id}`)

}