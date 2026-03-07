import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";  // đường dẫn đúng của mày
import Header from "../components/admin/Header";

export default function AdminLayout() {
  return (
    <div style={{ 
      display: "flex", 
      height: "100vh",           // full viewport height
      width: "100vw",            // full viewport width
      overflow: "hidden"         // tránh scroll thừa
    }}>
      {/* Sidebar fixed bên trái */}
      <Sidebar />

      {/* Content bên phải: chiếm hết còn lại */}
      <div style={{ 
        flex: 1,                   // ← quan trọng vl, chiếm hết width còn lại
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        {/* Header (nếu có, full width) */}
        <Header />

        {/* Main content: full height còn lại, scroll nếu dài */}
        <main style={{ 
          flex: 1,                 // ← căng full height
          overflowY: "auto",       // scroll dọc nếu bảng dài
          padding: "20px",
          backgroundColor: "#f8fafc"  // nền sáng nhẹ cho đẹp
        }}>
          <Outlet />  {/* DonViList render ở đây và sẽ full */}
        </main>
      </div>
    </div>
  );
}