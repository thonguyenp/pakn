import { useState } from "react";
import { useNotification } from "@/contexts/NotificationContext";

const NotificationDropdown = () => {
    const { notifications, markAsRead } = useNotification();
    const [open, setOpen] = useState(false);

    const unreadCount = notifications.filter(tb => tb.DaDoc === 0).length;

    return (
        <div className="relative">
            {/* 🔔 Bell icon */}
            <button
                onClick={() => setOpen(!open)}
                className="relative"
            >
                <i className="fa-regular fa-bell text-xl">
                </i>

                {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* 📥 Dropdown */}
            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded z-50">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            Không có thông báo
                        </div>
                    ) : (
                        notifications.map((tb) => (
                            <div
                                key={tb.IdThongBao}
                                onClick={() => markAsRead(tb.IdThongBao)}
                                className={`p-3 border-b cursor-pointer ${tb.DaDoc
                                        ? "bg-gray-100"
                                        : "bg-blue-50"
                                    }`}
                            >
                                <div className="font-bold">
                                    {tb.TieuDe}
                                </div>
                                <div className="text-sm">
                                    {tb.NoiDung}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;