import type { User, UserDetail } from "../types/user"
import type { Pagination } from "../types/pagination"
import { api } from "./api"

export const userApi = {

  getAll: (page: number = 1) =>
    api.get<Pagination<User>>(`/admin/nguoidung?page=${page}`),

  getById: (id: number) =>
    api.get<UserDetail>(`/admin/nguoidung/${id}`),

  create: (data: Partial<User>) =>
    api.post("/admin/nguoidung", data),

  update: (id: number, data: Partial<User>) =>
    api.post(`/admin/nguoidung/update/${id}`, data),

  delete: (id: number) =>
    api.delete(`/admin/nguoidung/${id}`),

  updatePermissions: (id: number, permissions: number[]) =>
    api.post(`/admin/nguoidung/permissions/${id}`, {
      permissions
    })
}