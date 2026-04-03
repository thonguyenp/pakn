import { api } from "@/api/api";
import type { PhanHoiCreateRequest } from "@/types/phanHoi";

export const createPhanHoi = async (data: PhanHoiCreateRequest) => {
  const formData = new FormData();

  formData.append("NoiDung", data.NoiDung);
  formData.append("IdPhanAnh", data.IdPhanAnh.toString());

  if (data.LaNoiBo !== undefined) {
    formData.append("LaNoiBo", String(data.LaNoiBo));
  }

  if (data.IdNguoiDung) {
    formData.append("IdNguoiDung", String(data.IdNguoiDung));
  }

  if (data.files) {
    data.files.forEach((file) => {
      formData.append("files[]", file);
    });
  }

  const response = await api.post("phanhoi", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
};