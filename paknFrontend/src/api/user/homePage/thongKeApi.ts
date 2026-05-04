import { api } from "@/api/api"

export const getThongKeTrangThai = async () => {
  const res = await api.get("/thong-ke/trang-thai")
  return res.data
}