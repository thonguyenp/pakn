import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  User,
  LogOut,
  ScrollText,
  Menu,
  ChevronLeft
} from "lucide-react";

export default function Sidebar() {

  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-slate-900 p-2 rounded"
      >
        <Menu size={20} color="white" />
      </button>

      <aside
        className={`
        fixed md:relative z-40
        ${collapsed ? "w-20" : "w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        h-screen bg-slate-900 text-white flex flex-col
        transition-all duration-300
        `}
      >

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">

          {!collapsed && (
            <h6
              onClick={() => navigate("/admin")}
              className="font-semibold cursor-pointer"
            >
              {user.HoTen}
            </h6>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-slate-800 rounded"
          >
            <ChevronLeft
              size={18}
              className={`transition-transform ${collapsed ? "rotate-180" : ""}`}
            />
          </button>

        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-2">

          <ul className="space-y-2">

            {/* Quản lý người dùng */}
            <li
              onClick={() => navigate("/admin/nguoidung")}
              className={`
              flex items-center gap-3 px-3 py-2 rounded cursor-pointer
              ${isActive("/admin/nguoidung") ? "bg-blue-800" : "hover:bg-slate-800"}
              `}
            >
              <User size={18} />
              {!collapsed && "Quản lý người dùng"}
            </li>

            {/* Quản lý phản ánh */}
            <li
              onClick={() => navigate("/admin/phananh")}
              className={`
              flex items-center gap-3 px-3 py-2 rounded cursor-pointer
              ${isActive("/admin/phananh") ? "bg-blue-800" : "hover:bg-slate-800"}
              `}
            >
              <ScrollText size={18} />
              {!collapsed && "Quản lý phản ánh"}
            </li>

            {/* Logout */}
            <li
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800 cursor-pointer text-red-400"
            >
              <LogOut size={18} />
              {!collapsed && "Đăng xuất"}
            </li>

          </ul>

        </nav>
      </aside>
    </>
  );
}