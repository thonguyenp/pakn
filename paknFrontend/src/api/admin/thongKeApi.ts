import { api } from "@/api/api";
import type { TongQuanResponse } from "@/types/thongKe";

export const getThongKeTongQuan = async (
  from: string,
  to: string
) => {

  const response = await api.get<TongQuanResponse>(
    "admin/thongke/tongquan",
    {
      params: {
        from,
        to
      }
    }
  )

  return response.data
}
export const getThongKeDashboard =
  async (): Promise<TongQuanResponse> => {

    const response = await api.get(
      "admin/thongke/dashboard"
    )

    return response.data
  }
export const getThongKeNguoiDung6Thang =
  async () => {
    const response = await api.get(
      "admin/thongke/dashboard-nguoidung"
    )
    return response.data
  }
export type { TongQuanResponse } from "@/types/thongKe"