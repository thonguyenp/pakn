import {api} from "@/api/api";

export const guiPhanAnh = async (formData: FormData) => {
  const response = await api.post("phananh", formData);

  return response.data;
};

