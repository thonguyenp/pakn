import { api } from "@/api/api"

export const getThongKeTrangThai = async () => {
  const res = await api.get("/thongke/trang-thai")
  return res.data
}

export const getThongKeMucDoHaiLong = async () => {
  const res = await api.get("/thongke/muc-do-hai-long")
  return res.data
}

export const getThongKeTreHan = async () => {
  const res = await api.get("/thongke/tre-han-kip-han")
  return res.data
}