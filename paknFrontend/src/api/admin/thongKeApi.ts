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

export type { TongQuanResponse } from "@/types/thongKe"