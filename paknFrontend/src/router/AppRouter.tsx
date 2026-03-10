// AppRouter.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";      // import layout của bạn
import AdminLayout from "../layouts/AdminLayout";

import DashboardPage from "../modules/admin/dashboard/DashboardPage";
import DonViList from "../modules/admin/donvi/DonViList";
import DonViCreate from "../modules/admin/donvi/DonViCreate";
import DonViEdit from "../modules/admin/donvi/DonViEdit";
import LoginPage from "@/modules/auth/LoginPage";
import RegisterPage from "@/modules/auth/RegisterPage";
import Dashboard from "@/modules/pages/Dashboard";
import ResetPassword from "@/modules/auth/ResetPassword";
import ForgotPassword from "@/modules/auth/ForgotPassword";
import UserList from "@/modules/admin/users/UserList";
import UserCreate from "@/modules/admin/users/CreateUser";
import UserEdit from "@/modules/admin/users/EditUser";
import UserPermissions from "@/modules/admin/users/UserPermissions";
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Các route public không cần layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Các route user bọc bởi UserLayout */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Dashboard />} />
          {/* Thêm các route user khác ở đây */}
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="donvi">
            <Route index element={<DonViList />} />
            <Route path="create" element={<DonViCreate />} />
            <Route path="edit/:id" element={<DonViEdit />} />
          </Route>
          <Route path="nguoidung">
            <Route index element={<UserList />} />
            <Route path="create" element={<UserCreate />} />
            <Route path="edit/:id" element={<UserEdit />} />
            <Route path="permissions/:id" element={<UserPermissions/>}/>
          </Route>

        </Route>

        {/* 404 */}
        <Route path="*" element={<h1>404 - Không tìm thấy trang</h1>} />
      </Routes>
    </BrowserRouter>
  );
}