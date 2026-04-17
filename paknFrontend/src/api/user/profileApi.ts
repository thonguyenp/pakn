import { api } from "@/api/api";

// 👉 Lấy thông tin user
export const getProfile = async () => {
    return await api.get("/profile");
};

export const getNotification = async () => {
    return await api.get(`/thongbao`);
}

// 👉 Cập nhật profile
export const updateProfileApi = async (data: {
    HoTen: string;
    SoDienThoai: string;
}) => {
    return await api.put("/profile", data);
};