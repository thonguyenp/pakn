import { api } from "@/api/api"

export interface Slider {
  IdSlider: number
  TieuDe: string
  MoTa: string
  Anh: string
  Link: string
  ThuTu: number
  TrangThai: number
  NgayBatDau: string | null
  NgayKetThuc: string | null
}

export interface SliderResponse {
  message: string
  data: Slider[]
}

// lấy danh sách slider
export const getSliders = async () => {
  const response = await api.get<SliderResponse>("admin/slider")
  return response.data
}
export const getPulicSliders = async () => {
  const response = await api.get<SliderResponse>("sliders")
  return response.data
}

// tạo slider
export const createSlider = async (formData: FormData) => {
  const response = await api.post("admin/slider", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

// cập nhật slider
export const updateSlider = async (
  id: number,
  formData: FormData
) => {
  formData.append("_method", "PUT")

  const response = await api.post(
    `admin/slider/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )

  return response.data
}

// ẩn slider
export const deleteSlider = async (id: number) => {
  const response = await api.delete(`admin/slider/${id}`)
  return response.data
}