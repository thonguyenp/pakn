import axios from "axios"
import { type DonVi } from "../types/donvi"
import type { Pagination } from "../types/pagination"

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json"
  }
})

export const donViApi = {

  getAll: (page: number = 1) =>
    api.get<Pagination<DonVi>>(`/donvi?page=${page}`),

  getById: (id: number) =>
    api.get<DonVi>(`/donvi/${id}`),

  create: (data: DonVi) =>
    api.post("/donvi", data),

  update: (id: number, data: DonVi) =>
    api.put(`/donvi/${id}`, data),

  delete: (id: number) =>
    api.delete(`/donvi/${id}`)
}