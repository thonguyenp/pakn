import { api } from "@/api/api"

export const danhGiaApi = {
  // lấy danh sách đánh giá theo phản hồi
  getByPhanHoi: (idPhanHoi: number) =>
    api.get(`/danhgia/${idPhanHoi}`),

  // gửi đánh giá
  create: (data: {
    MucDoHaiLong: number
    NhanXet?: string
    IdPhanHoi: number
  }) => api.post("/danhgia", data),
}