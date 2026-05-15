import { api } from "../api"

export interface LichSuXuLyParams {
    page?: number
    Loai?: string
    from?: string
    to?: string
    search?: string
}

export const getLichSuXuLy = async (
    params: LichSuXuLyParams
) => {

    const response = await api.get(
        "/admin/lichsu",
        {
            params
        }
    )

    return response.data
}