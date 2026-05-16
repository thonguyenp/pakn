import { useNotification } from "@/contexts/NotificationContext";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const NotificationDropdown = () => {
    const {
        notifications,
        markAsRead,
        unreadCount,
        total
    } = useNotification();

    const [open, setOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const latestNotifications = notifications.slice(0, 5);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
        });
    };

    const getUrl = (link: any) => {
        try {
            let parsedLink;

            if (typeof link === "string") {
                parsedLink = JSON.parse(link);
            } else {
                parsedLink = link;
            }

            return parsedLink.url || "#";
        } catch (err) {
            console.error("Lỗi parse link:", err);
            return "#";
        }
    };

    return (
        <div ref={dropdownRef} className="relative">
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
                                <Link
                                    key={tb.IdThongBao}
                                    to={getUrl(tb.Link)}
                                    onMouseDown={() => {
                                        if (!tb.DaDoc) {
                                            markAsRead(tb.IdThongBao);
                                        }
                                    }}
                                    className={`block p-3 border-b transition ${
                                        tb.DaDoc
                                            ? "bg-gray-50 hover:bg-gray-100"
                                            : "bg-blue-100 hover:bg-blue-200"
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="font-bold">
                                            {tb.TieuDe}
                                        </div>

                                        <div className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                            {formatDate(tb.NgayTao)}
                                        </div>
                                    </div>

                                    <div className="text-sm mt-1 text-gray-700">
                                        {tb.NoiDung}
                                    </div>
                                </Link>
                            ))}

                            {total > 5 && (
                                <Link
                                    to="/thong-tin-ca-nhan#notifications"
                                    className="block p-3 text-center text-[#0C4396] hover:bg-gray-100"
                                >
                                    Xem thêm
                                </Link>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;