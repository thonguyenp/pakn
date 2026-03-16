import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

export default function Header() {

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");

    const [open, setOpen] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("permissions");
        window.location.href = "/login";
    };

    const isAdmin = permissions.includes("QuanLyHeThong");

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

            {/* HEADER */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <img src="./src/images/ntu_logo.jpg" className="h-10 w-auto" />
                        <div className="flex flex-col ml-2">
                            <span className="text-xs sm:text-sm text-[#4B6CB7]">
                                Hệ thống phản ánh
                            </span>
                            <span className="text-sm sm:text-lg md:text-xl font-bold">
                                Đại học Nha Trang
                            </span>
                        </div>
                    </Link>

                    {/* Desktop menu */}
                    <div className="hidden md:flex items-center space-x-6">

                        {!user && (
                            <>
                                <Link to="/login" className="hover:underline">
                                    Đăng nhập
                                </Link>

                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-[#1e54a4] text-white rounded-md"
                                >
                                    Đăng ký
                                </Link>
                            </>
                        )}

                        {user && (
                            <>
                                <i className="fa-regular fa-bell text-xl"></i>

                                <div className="relative" ref={dropdownRef}>

                                    <button
                                        onClick={() => setOpen(!open)}
                                        className="font-medium flex items-center gap-1"
                                    >
                                        {user.HoTen}
                                        <span className="text-xs">▼</span>
                                    </button>

                                    {open && (
                                        <div className="absolute right-0 top-full mt-2 w-56 bg-white shadow-lg rounded-md border z-50">

                                            <Link
                                                to="/thong-tin-ca-nhan"
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
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden text-2xl"
                        onClick={() => setMobileMenu(!mobileMenu)}
                    >
                        <i className="fa-solid fa-bars"></i>
                    </button>

                </div>
            </div>

            {/* NAVBAR DESKTOP */}
            <div className="hidden md:block bg-[#1e54a4] border-t border-[#d4e3ff] text-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-14">
                        <nav className="flex space-x-8 font-medium">
                            <Link to="/" className="hover:text-blue-600">
                                Trang chủ
                            </Link>
                            <Link to="/danh-muc" className="hover:text-blue-600">
                                Danh mục phản ánh
                            </Link>
                            <Link to="/huong-dan" className="hover:text-blue-600">
                                Hướng dẫn
                            </Link>
                            <Link to="/lien-he" className="hover:text-blue-600">
                                Liên hệ
                            </Link>
                        </nav>
                        <div className="relative w-64">
                            <input
                                type="text"
                                placeholder="Tìm phản ánh..."
                                className="w-full border rounded-md py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button className="absolute right-3 top-2.5 text-gray-500">
                                <i className="fa-solid fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU */}
            {mobileMenu && (
                <div className="md:hidden bg-white border-t">

                    <div className="flex flex-col p-4 space-y-3">

                        {/* USER AREA */}
                        {!user && (
                            <div className="flex flex-col gap-2 pb-3 border-b">
                                <Link to="/login" className="font-medium">
                                    Đăng nhập
                                </Link>

                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-[#1e54a4] text-white rounded-md text-center"
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}

                        {user && (
                            <div className="flex flex-col gap-2 pb-3 border-b">

                                <span className="font-medium">
                                    Xin chào, {user.HoTen}
                                </span>

                                <Link to="/thong-tin-ca-nhan">
                                    Thông tin cá nhân
                                </Link>

                                <Link to="/phan-anh">
                                    Phản ánh kiến nghị
                                </Link>

                                {isAdmin && (
                                    <Link to="/admin">
                                        Quản lý hệ thống
                                    </Link>
                                )}

                                <button
                                    onClick={logout}
                                    className="text-left text-red-600"
                                >
                                    Đăng xuất
                                </button>

                            </div>
                        )}

                        {/* NAV LINKS */}
                        <Link to="/">Trang chủ</Link>
                        <Link to="/danh-muc">Danh mục phản ánh</Link>
                        <Link to="/huong-dan">Hướng dẫn</Link>
                        <Link to="/lien-he">Liên hệ</Link>

                        {/* SEARCH */}
                        <div className="relative mt-3">

                            <input
                                type="text"
                                placeholder="Tìm phản ánh..."
                                className="w-full border rounded-md py-2 pl-4 pr-10"
                            />

                            <i className="fa-solid fa-search absolute right-3 top-3 text-gray-500"></i>

                        </div>
                        {/* <SearchInput placeholder="Tìm phản ánh..." /> */}
                    </div>

                </div>
            )}

        </header>
    );
}