import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

export default function Header() {

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("permissions");
        window.location.href = "/login";
    };

    const isAdmin = permissions.includes("QuanLyHeThong");

    // click ngoài menu -> đóng
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

    return (
        <header className="sticky top-0 z-50 bg-[#E6F0FF] text-[#0C4396] shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex flex-row">
                            <img src="./src/images/ntu_logo.jpg" className="h-12 w-auto" />
                            <div className="flex flex-col ml-2">
                                <span className="text-sm text-[#4B6CB7]">
                                    Hệ thống phản ánh kiến nghị
                                </span>
                                <span className="text-2xl font-bold">
                                    Trường Đại học Nha Trang
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Chưa login */}
                    {!user && (
                        <div className="flex items-center space-x-6">
                            <Link to="/login" className="hover:underline">
                                Đăng nhập
                            </Link>

                            <Link
                                to="/register"
                                className="px-6 py-2 bg-[#1e54a4] text-white rounded-md"
                            >
                                Đăng ký ngay
                            </Link>
                        </div>
                    )}

                    {/* Đã login */}
                    {user && (
                        <div className="flex items-center space-x-6">

                            {/* Chuông */}
                            <i className="fa-regular fa-bell text-xl"></i>

                            {/* User menu */}
                            <div className="relative" ref={dropdownRef}>

                                <button
                                    onClick={() => setOpen(!open)}
                                    className="font-medium flex items-center gap-1"
                                >
                                    Xin chào, {user.HoTen}
                                    <span className="text-xs">▼</span>
                                </button>

                                {open && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md border">

                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 hover:bg-gray-100"
                                        >
                                            Thông tin cá nhân
                                        </Link>

                                        <Link
                                            to="/phan-anh"
                                            className="block px-4 py-2 hover:bg-gray-100"
                                        >
                                            Phản ánh kiến nghị
                                        </Link>

                                        {isAdmin && (
                                            <Link
                                                to="/admin"
                                                className="block px-4 py-2 hover:bg-gray-100"
                                            >
                                                Quản lý hệ thống
                                            </Link>
                                        )}

                                        <button
                                            onClick={logout}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                        >
                                            Đăng xuất
                                        </button>

                                    </div>
                                )}

                            </div>

                        </div>
                    )}

                </div>
            </div>
        </header>
    );
}