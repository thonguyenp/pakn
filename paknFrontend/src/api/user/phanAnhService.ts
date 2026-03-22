import { api } from "@/api/api";
import type { Pagination } from "@/types/pagination";
import type { PhanAnh } from "@/types/phanAnh";

export interface PhanAnhFilter {
  page?: number
  MucDoKhanCap?: number
  IdTrangThaiPhanAnh?: number
  AnDanh?: number
}

export const guiPhanAnh = async (formData: FormData) => {
  const response = await api.post("phananh", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
};

export const getPhanAnhCuaToi = async (
  filter: PhanAnhFilter
): Promise<Pagination<PhanAnh>> => {

  const response = await api.get("/phananh/xem", {
    params: filter
  })

  return response.data.data
}

export const getPhanAnhDonVi = async (
  filter: PhanAnhFilter
): Promise<Pagination<PhanAnh>> => {

  const response = await api.get("/phananh/donvi", {
    params: filter
  })

  return response.data.data
}

export const getPhanAnhChiTiet = async (MaTheoDoi: string) => {
  const response = await api.get(`/phananh/${MaTheoDoi}`);
  return response.data.data;
};