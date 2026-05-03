import { api } from "@/api/api";
import type { LinhVuc } from "@/types/linhvuc";
import type { PhanAnh } from "@/types/phanAnh";

// ===== TYPE =====
export interface PhanAnhTheoLinhVuc {
    linh_vuc: LinhVuc;
    phan_anhs: PhanAnh[];
}

export interface HomeResponse {
    phan_anh_noi_bat: PhanAnh[];
    phan_anh_theo_linh_vuc: PhanAnhTheoLinhVuc[];
}

// ===== API =====
export const getHomeData = async (): Promise<HomeResponse> => {
    const res = await api.get("/home");
    return res.data;
};