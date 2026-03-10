import axios from "axios"
import type { User, UserDetail } from "../types/user"
import type { Pagination } from "../types/pagination"

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json"
  }
})

export const userApi = {

  getAll: (page: number = 1) =>
    api.get<Pagination<User>>(`/nguoidung?page=${page}`),

  getById: (id: number) =>
    api.get<UserDetail>(`/nguoidung/${id}`),

  create: (data: Partial<User>) =>
    api.post("/nguoidung", data),

  update: (id: number, data: Partial<User>) =>
    api.post(`/nguoidung/update/${id}`, data),

  delete: (id: number) =>
    api.delete(`/nguoidung/${id}`),

  updatePermissions: (id: number, permissions: number[]) =>
    api.post(`/nguoidung/permissions/${id}`, {
      permissions
    })
}