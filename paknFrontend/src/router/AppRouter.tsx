import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

import DashboardPage from "../modules/admin/dashboard/DashboardPage";

// Import các component mới (điều chỉnh đường dẫn nếu folder khác)
import DonViList from "../modules/admin/donvi/DonViList";
import DonViCreate from "../modules/admin/donvi/DonViCreate";
import DonViEdit from "../modules/admin/donvi/DonViEdit";
import LoginPage from "@/modules/auth/LoginPage";
import RegisterPage from "@/modules/auth/RegisterPage";
import Dashboard from "@/modules/pages/Dashboard";  // Trang dashboard chính sau khi login

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />

          {/* Quản lý đơn vị - tách thành 3 route */}
          <Route path="donvi">
            <Route index element={<DonViList />} />           {/* /admin/donvi */}
            <Route path="create" element={<DonViCreate />} />  {/* /admin/donvi/create */}
            <Route path=":id/edit" element={<DonViEdit />} />  {/* /admin/donvi/5/edit */}
          </Route>

          {/* Các route khác của admin sẽ thêm ở đây sau */}
        </Route>

        {/* Nếu có route public hoặc login/logout thì thêm ở ngoài /admin */}
        {/* Ví dụ: <Route path="/login" element={<LoginPage />} /> */}
      {/* <Route path="*" element={<h1>404 - Không tìm thấy trang bro!</h1>} /> */}
      </Routes>
    </BrowserRouter>
  );
}