import { createContext, useContext, useEffect, useState } from "react";
import { createEcho } from "@/lib/echo";
import axios from "axios";

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

    const userId = user.IdNguoiDung;

    // 📥 Load danh sách ban đầu
    useEffect(() => {
        if (!token || !userId) return;

        axios
            .get(`http://paknproj.test/api/thongbao/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setNotifications(res.data);
            });
    }, [token, userId]);

    // 🔥 Realtime
    useEffect(() => {
        if (!token || !userId) return;

        const echo = createEcho(token);

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
        await axios.post(
            `http://paknproj.test/api/thongbao/read/${id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        setNotifications((prev) =>
            prev.map((tb) =>
                tb.IdThongBao === id ? { ...tb, DaDoc: 1 } : tb
            )
        );
    };

    return (
        <NotificationContext.Provider
            value={{ notifications, setNotifications, markAsRead }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

// hook dùng cho tiện
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotification must be used inside Provider");
    return context;
};