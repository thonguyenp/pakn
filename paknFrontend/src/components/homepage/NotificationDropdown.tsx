import { useState } from "react";
import { useNotification } from "@/contexts/NotificationContext";
import { useNavigate } from "react-router-dom";

const NotificationDropdown = () => {
    const { notifications, markAsRead, unreadCount, total } = useNotification();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const latestNotifications = notifications.slice(0, 5);

    // 👉 format ngày
    const formatDate = (date: string) => {
        return new Date(date).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
        });
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="relative"
            >
                <i className="fa-regular fa-bell text-xl"></i>

                {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded z-50">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            Không có thông báo
                        </div>
                    ) : (
                        <>
                            {latestNotifications.map((tb) => (
                                <div
                                    key={tb.IdThongBao}
                                    onClick={() => markAsRead(tb.IdThongBao)}
                                    className={`p-3 border-b cursor-pointer transition ${tb.DaDoc
                                        ? "bg-gray-50 hover:bg-gray-100"
                                        : "bg-blue-100 hover:bg-blue-200"
                                        }`}
                                >
                                    {/* 👉 Header: title + date */}
                                    <div className="flex justify-between items-start">
                                        <div className="font-bold">
                                            {tb.TieuDe}
                                        </div>
                                        <div className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                            {formatDate(tb.NgayTao)}
                                        </div>
                                    </div>

                                    {/* 👉 Content */}
                                    <div className="text-sm mt-1 text-gray-700">
                                        {tb.NoiDung}
                                    </div>
                                </div>
                            ))}

                            {total > 5 && (
                                <div
                                    onClick={() => navigate("/thong-tin-ca-nhan", { state: { tab: "notifications" } })}
                                    className="p-3 text-center text-[#0C4396] cursor-pointer hover:bg-gray-100"
                                >
                                    Xem thêm
                                </div>
                            )}
                        </>
                    )}
                </div>
                
            )

            }
        </div >
    );
};

export default NotificationDropdown;