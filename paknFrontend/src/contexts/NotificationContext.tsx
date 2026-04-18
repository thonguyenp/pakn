import { createContext, useContext, useEffect, useState } from "react";
import { createEcho } from "@/lib/echo";
import { api } from "@/api/api";

type Notification = {
    IdThongBao: number;
    TieuDe: string;
    NoiDung: string;
    DaDoc: number;
    NgayTao: string;
};

type ContextType = {
    notifications: Notification[];
    unreadCount: number;
    total: number;
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
    markAsRead: (id: number) => Promise<void>;
    refreshNotifications: () => Promise<void>;
};

const NotificationContext = createContext<ContextType | null>(null);

export const NotificationProvider = ({ children }: any) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [total, setTotal] = useState(0);

    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("user");
    const user = rawUser ? JSON.parse(rawUser) : null;
    const userId = user?.IdNguoiDung;

    // =============================
    // 📥 Load initial (dropdown only)
    // =============================
    const fetchNotifications = async () => {
        try {
            const res = await api.get(`thongbao?per_page=5`);

            // 🔥 đảm bảo luôn là array
            setNotifications(Array.isArray(res.data.data) ? res.data.data : []);
            setUnreadCount(res.data.unread_count ?? 0);
            setTotal(res.data.total ?? 0);
        } catch (err) {
            console.error("Load thông báo lỗi:", err);
        }
    };

    useEffect(() => {
        if (!token) return;
        fetchNotifications();
    }, [token, userId]);

    // =============================
    // 🔥 Realtime (WebSocket)
    // =============================
    useEffect(() => {
        if (!token || !userId) return;

        const echo = createEcho(token);

        echo.private(`user.${userId}`)
            .listen(".thongbao.created", (e: any) => {
                const newTb = e.thongBao;

                // thêm vào đầu list (dropdown)
                setNotifications((prev) => [newTb, ...prev].slice(0, 5));

                // tăng unread count
                setUnreadCount((prev) => prev + 1);
            });

        return () => {
            echo.disconnect();
        };
    }, [token, userId]);

    // =============================
    // ✅ Mark as read
    // =============================
    const markAsRead = async (id: number) => {
        try {
            await api.post(`thongbao/read/${id}`);

            setNotifications((prev) =>
                prev.map((tb) =>
                    tb.IdThongBao === id ? { ...tb, DaDoc: 1 } : tb
                )
            );

            // giảm unread count
            setUnreadCount((prev) => Math.max(prev - 1, 0));
        } catch (err) {
            console.error("Mark as read lỗi:", err);
        }
    };

    // =============================
    // 🔄 Refresh thủ công (nếu cần)
    // =============================
    const refreshNotifications = async () => {
        await fetchNotifications();
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                total,
                setNotifications,
                markAsRead,
                refreshNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

// =============================
// hook
// =============================
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used inside Provider");
    }
    return context;
};