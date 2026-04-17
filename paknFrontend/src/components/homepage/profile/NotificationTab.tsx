import { useEffect, useState } from "react";
import { getNotification } from "@/api/user/profileApi";

interface ThongBao {
    IdThongBao: number;
    TieuDe: string;
    NoiDung: string;
    NgayTao: string;
    DaDoc: number;
}

export default function NotificationTab() {
    const [notifications, setNotifications] = useState<ThongBao[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await getNotification();
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString("vi-VN");
    };

    if (loading) {
        return <div>Đang tải thông báo...</div>;
    }

    return (
        <div className="flex flex-col gap-3">
            {notifications.length === 0 ? (
                <div className="text-gray-500 text-center">
                    Không có thông báo
                </div>
            ) : (
                notifications.map((tb) => (
                    <div
                        key={tb.IdThongBao}
                        className={`p-4 rounded border ${
                            tb.DaDoc
                                ? "bg-gray-50"
                                : "bg-blue-100"
                        }`}
                    >
                        <div className="flex justify-between">
                            <div className="font-semibold">
                                {tb.TieuDe}
                            </div>
                            <div className="text-xs text-gray-500">
                                {formatDate(tb.NgayTao)}
                            </div>
                        </div>

                        <div className="text-sm mt-1 text-gray-700">
                            {tb.NoiDung}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}