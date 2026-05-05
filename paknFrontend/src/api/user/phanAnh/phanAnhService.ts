import { api } from "@/api/api";
import type { Pagination } from "@/types/pagination";
import type { PhanAnh } from "@/types/phanAnh";
import type { CapNhatPhanAnhPayload, PhanHoiCreateRequest } from "@/types/phanHoi";

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
export const getPhanAnhPublic = async (
  maTheoDoi: string,
  ngayGui: string
): Promise<PhanAnh> => {
  const res = await api.get(`/phananh/public/${maTheoDoi}/${ngayGui}`)
  return res.data.data
}

export const traCuuPhanAnh = async (maTheoDoi: string, ngayGui: string) => {
  const response = await api.get("/phananh/traCuu", {
    params: {
      maTheoDoi,
      ngayGui,
    },
  })

  return response.data
};
export const searchPhanAnh = (
  q: string,
  page = 1,
  id_linh_vuc?: number,
  id_don_vi?: number
) => {
  return api.get("/phananh/timKiem", {
    params: {
      q,
      page,
      id_linh_vuc,
      id_don_vi
    }
  });
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

export const createAction = async (
  MaTheoDoi: string,
  data: any
) => {
  const formData = new FormData();

  formData.append("NoiDung", data.NoiDung);
  formData.append("action", data.action);

  if (data.donVi) {
    formData.append("DonVi", data.donVi);
  }
  if (data.LaNoiBo !== undefined) {
    formData.append("LaNoiBo", String(data.LaNoiBo));
  }



  if (data.files) {
    data.files.forEach((file: File) => {
      formData.append("files[]", file);
    });
  }

  return api.post(`phananh/action/${MaTheoDoi}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const capNhatPhanAnh = async (data: CapNhatPhanAnhPayload) => {
  const formData = new FormData()

  formData.append("maTheoDoi", data.maTheoDoi)
  formData.append("ngayGui", data.ngayGui)
  formData.append("NoiDung", data.NoiDung)

  if (data.files && data.files.length > 0) {
    data.files.forEach((file) => {
      formData.append("files[]", file)
    })
  }

  const response = await api.post("/phananh/capNhat", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })

  return response.data
}