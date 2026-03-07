import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const sidebarStyle = {
    width: isCollapsed ? 80 : 250,
    backgroundColor: "#0f172a", // slate-900
    color: "white",
    height: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    transition: "width 0.3s ease-in-out",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px",
    borderBottom: "1px solid #334155", // slate-700
  };

  const toggleButtonStyle = {
    padding: "8px",
    borderRadius: "9999px",
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.2s",
  };

  const toggleHoverStyle = {
    backgroundColor: "#334155", // slate-700 on hover
  };

  const navStyle = {
    flex: 1,
    overflowY: "auto" as const,
    padding: "16px 0",
  };

  const ulStyle = {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
    paddingLeft: "12px",
    paddingRight: "12px",
  };

  const getItemStyle = (active: boolean) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 12px",
    borderRadius: "8px",
    textDecoration: "none",
    color: active ? "white" : "#cbd5e1", // slate-300
    backgroundColor: active ? "#334155" : "transparent", // slate-700 if active
    transition: "all 0.2s ease",
    cursor: "pointer",
    justifyContent: isCollapsed ? "center" : "flex-start",
    ':hover': {
      backgroundColor: "#1e293b", // slate-800 on hover
      color: "white",
    },
  });

  const iconStyle = {
    flexShrink: 0,
  };

  const footerStyle = {
    padding: "16px",
    borderTop: "1px solid #334155", // slate-700
    fontSize: "0.875rem",
    color: "#94a3b8", // slate-400
  };

  return (
    <div style={sidebarStyle}>
      {/* Header */}
      <div style={headerStyle}>
        {!isCollapsed && (
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", letterSpacing: "-0.025em" }}>
            PAKN Admin
          </h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={toggleButtonStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, toggleHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, { backgroundColor: "transparent" })}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu */}
      <nav style={navStyle}>
        <ul style={ulStyle}>
          {/* Dashboard */}
          <li>
            <Link
              to="/admin"
              style={getItemStyle(isActive("/admin") && !isActive("/admin/"))}
            >
              <LayoutDashboard size={20} style={iconStyle} />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </li>

          {/* Quản lý đơn vị */}
          <li>
            <Link
              to="/admin/donvi"
              style={getItemStyle(isActive("/admin/donvi"))}
            >
              <Building2 size={20} style={iconStyle} />
              {!isCollapsed && <span>Quản lý đơn vị</span>}
            </Link>
          </li>

          {/* Quản lý người dùng */}
          <li>
            <Link
              to="/admin/users"
              style={getItemStyle(isActive("/admin/users"))}
            >
              <Users size={20} style={iconStyle} />
              {!isCollapsed && <span>Quản lý người dùng</span>}
            </Link>
          </li>

          {/* Phản ánh */}
          <li>
            <Link
              to="/admin/phananh"
              style={getItemStyle(isActive("/admin/phananh"))}
            >
              <MessageSquare size={20} style={iconStyle} />
              {!isCollapsed && <span>Phản ánh</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div style={footerStyle}>
        {!isCollapsed && <>© {new Date().getFullYear()} PAKN</>}
      </div>
    </div>
  );
}