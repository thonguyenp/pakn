import { useEffect, useState } from "react";
import { getNotification } from "@/api/user/profileApi";
import { Link } from "react-router-dom";
import { useNotification } from "@/contexts/NotificationContext";
import { type ThongBao } from "@/types/thongBao";

export default function NotificationTab() {
    const [notifications, setNotifications] = useState<ThongBao[]>([]);
    const { markAsRead } = useNotification();
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const fetchNotifications = async (page = 1) => {
        try {
            const res = await getNotification(page);

            setNotifications(res.data.data);
            setCurrentPage(res.data.current_page);
            setLastPage(res.data.last_page);

            console.log(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications(currentPage);
    }, [currentPage]);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString("vi-VN");
    };

    const getUrl = (link: any) => {
        try {
            let parsedLink;
            if (typeof link === "string") {
                parsedLink = JSON.parse(link);
            }
            else {
                parsedLink = link;
            }
            return parsedLink.url || "#";
        }
        catch (err) {
            console.error("Lỗi khi phân tích link:", err);
            return "#";
        }
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
                    <Link
                        key={tb.IdThongBao}
                        to={getUrl(tb.Link)}
                        onMouseDown={() => {
                            if (!tb.DaDoc) {
                                markAsRead(tb.IdThongBao);
                            }
                        }}
                        className={`p-4 rounded border hover:shadow transition block ${tb.DaDoc
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
                    </Link>
                ))
            )}

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Trước
                </button>

                <span className="px-3 py-1">
                    {currentPage} / {lastPage}
                </span>

                <button
                    disabled={currentPage === lastPage}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Sau
                </button>
            </div>
        </div>
    );
}