import {api} from "@/api/api";
import type { PhanAnh } from "@/types/phanAnh";

export const guiPhanAnh = async (formData: FormData) => {
  const response = await api.post("phananh", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
};

export const getPhanAnhCuaToi = async (): Promise<PhanAnh[]> => {
  const response = await api.get("/phananh/xem")
  return response.data.data
}

export const getPhanAnhDonVi = async (): Promise<PhanAnh[]> => {
  const response = await api.get("/phananh/donvi")
  return response.data.data
}