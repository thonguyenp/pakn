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
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
    markAsRead: (id: number) => Promise<void>;
};

const NotificationContext = createContext<ContextType | null>(null);

export const NotificationProvider = ({ children }: any) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const userId = user?.IdNguoiDung;

    // 📥 Load danh sách ban đầu
    useEffect(() => {
        if (!token || !userId) return;

        const fetchData = async () => {
            try {
                const res = await api.get(`thongbao/${userId}`);
                setNotifications(res.data);
            } catch (err) {
                console.error("Load thông báo lỗi:", err);
            }
        };

        fetchData();
    }, [token, userId]);

    // 🔥 Realtime
    useEffect(() => {
        if (!token || !userId) return;

        const echo = createEcho(token);

        // 🔥 DEBUG WS
        echo.connector.pusher.connection.bind('connecting', () => {
            console.log('⏳ WS connecting...');
        });

        echo.connector.pusher.connection.bind('connected', () => {
            console.log('✅ WS connected');
            console.log(token);
            console.log(userId);
        });

        echo.connector.pusher.connection.bind('error', (err: any) => {
            console.error('❌ WS error:', err);
        });

        echo.connector.pusher.connection.bind('unavailable', () => {
            console.log('⚠️ WS unavailable');
        });

        // 🔥 LISTEN EVENT
        echo.private(`user.${userId}`)
            .listen(".thongbao.created", (e: any) => {
                console.log("🔥 New:", e.thongBao);

                setNotifications((prev) => [e.thongBao, ...prev]);
            });

        return () => {
            echo.disconnect();
        };
    }, [token, userId]);
    // ✅ Mark as read
    const markAsRead = async (id: number) => {
        try {
            await api.post(`thongbao/read/${id}`);

            setNotifications((prev) =>
                prev.map((tb) =>
                    tb.IdThongBao === id ? { ...tb, DaDoc: 1 } : tb
                )
            );
        } catch (err) {
            console.error("Mark as read lỗi:", err);
        }
    };

    return (
        <NotificationContext.Provider
            value={{ notifications, setNotifications, markAsRead }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

// hook
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotification must be used inside Provider");
    return context;
};