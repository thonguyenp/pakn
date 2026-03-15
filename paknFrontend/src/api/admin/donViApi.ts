import { type DonVi } from "@/types/donvi"
import type { Pagination } from "@/types/pagination"
import { api } from "../api"

export const donViApi = {
  getList: () =>
    api.get<DonVi[]>(`/admin/donvi/list`),

  getAll: (page: number = 1) =>
    api.get<Pagination<DonVi>>(`/admin/donvi?page=${page}`),

  getById: (id: number) =>
    api.get<DonVi>(`/admin/donvi/${id}`),

  create: (data: DonVi) =>
    api.post("/admin/donvi", data),

  update: (id: number, data: DonVi) =>
    api.put(`/admin/donvi/${id}`, data),

  delete: (id: number) =>
    api.delete(`/admin/donvi/${id}`)
}