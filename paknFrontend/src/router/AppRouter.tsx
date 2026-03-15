import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

import DashboardPage from "../modules/admin/dashboard/DashboardPage";

import DonViList from "../modules/admin/donvi/DonViList";
import DonViCreate from "../modules/admin/donvi/DonViCreate";
import DonViEdit from "../modules/admin/donvi/DonViEdit";

import LoginPage from "@/modules/auth/LoginPage";
import RegisterPage from "@/modules/auth/RegisterPage";
import ForgotPassword from "@/modules/auth/ForgotPassword";
import ResetPassword from "@/modules/auth/ResetPassword";

import Dashboard from "@/modules/pages/Dashboard";
import Profile from "@/modules/pages/profile/Profile";
import GuiPhanAnh from "@/modules/pages/PhanAnh/GuiPhanAnh";

import UserList from "@/modules/admin/users/UserList";
import UserCreate from "@/modules/admin/users/CreateUser";
import UserEdit from "@/modules/admin/users/EditUser";
import UserPermissions from "@/modules/admin/users/UserPermissions";

import PermissionGuard from "@/components/admin/PermissionGuard";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
// import PhanAnhList from "@/modules/admin/PhanAnh/PhanAnhList";
import PhanAnhEdit from "@/modules/admin/PhanAnh/PhanAnhEdit";
import PhanAnhForm from "@/modules/admin/PhanAnh/PhanAnhForm";
import PhanAnhList from "@/modules/admin/PhanAnh/PhanAnhList";
import PhanAnhDetail from "@/modules/admin/PhanAnh/PhanAnhDetail";
import PhanAnhCuaToi from "@/modules/pages/PhanAnh/PhanAnhCuaToi";
import PhanAnhDonVi from "@/modules/pages/PhanAnh/PhanAnhDonVi";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />


        {/* ================= USER ROUTES ================= */}

        <Route element={<UserLayout />}>

          {/* Trang chủ */}
          <Route path="/" element={<Dashboard />} />

          {/* Các route cần login */}
          <Route element={<ProtectedRoute />}>
            <Route path="/thong-tin-ca-nhan" element={<Profile />} />
            <Route path="/gui-phan-anh" element={<GuiPhanAnh />} />
            <Route path="/phananh">
              <Route path="cuatoi" element={<PhanAnhCuaToi />} />
              <Route
                path="donvi"
                element={
                  <PermissionGuard permission="XemPhanAnhPhong">
                    <PhanAnhDonVi />
                  </PermissionGuard>
                }
              />
            </Route>
          </Route>
        </Route>
        {/* ================= ADMIN ROUTES ================= */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/admin"
            element={
              <PermissionGuard permission="QuanLyHeThong">
                <AdminLayout />
              </PermissionGuard>
            }
          >
            {/* Dashboard */}
            <Route index element={<DashboardPage />} />
            {/* Phản ánh */}
            <Route path="phananh">
              <Route
                index
                element={
                  <PermissionGuard permission="XemTatCaPhanAnh">
                    <PhanAnhList />
                  </PermissionGuard>
                }
              >
              </Route>
              <Route
                path="xem/:id"
                element={
                  <PermissionGuard permission="XemTatCaPhanAnh">
                    <PhanAnhDetail />
                  </PermissionGuard>
                }
              >
              </Route>
              <Route
                path="edit/:id"
                element={
                  <PermissionGuard permission="XemTatCaPhanAnh">
                    <PhanAnhEdit />
                  </PermissionGuard>
                }
              >
              </Route>
              <Route
                path="create"
                element={
                  <PermissionGuard permission="XemTatCaPhanAnh">
                    <PhanAnhForm />
                  </PermissionGuard>
                }
              >
              </Route>

            </Route>
            {/* ================= QUẢN LÝ ĐƠN VỊ ================= */}
            <Route path="donvi">
              <Route
                index
                element={
                  <PermissionGuard permission="QuanLyHeThong">
                    <DonViList />
                  </PermissionGuard>
                }
              />
              <Route
                path="create"
                element={
                  <PermissionGuard permission="QuanLyHeThong">
                    <DonViCreate />
                  </PermissionGuard>
                }
              />
              <Route
                path="edit/:id"
                element={
                  <PermissionGuard permission="QuanLyHeThong">
                    <DonViEdit />
                  </PermissionGuard>
                }
              />
            </Route>
            {/* ================= QUẢN LÝ NGƯỜI DÙNG ================= */}
            <Route path="nguoidung">
              <Route
                index
                element={
                  <PermissionGuard permission="QuanLyNguoiDung">
                    <UserList />
                  </PermissionGuard>
                }
              />
              <Route
                path="create"
                element={
                  <PermissionGuard permission="QuanLyNguoiDung">
                    <UserCreate />
                  </PermissionGuard>
                }
              />
              <Route
                path="edit/:id"
                element={
                  <PermissionGuard permission="QuanLyNguoiDung">
                    <UserEdit />
                  </PermissionGuard>
                }
              />
              <Route
                path="permissions/:id"
                element={
                  <PermissionGuard permission="QuanLyQuyen">
                    <UserPermissions />
                  </PermissionGuard>
                }
              />
            </Route>
          </Route>

        </Route>
        {/* ================= 404 ================= */}

        <Route path="*" element={<h1>404 - Không tìm thấy trang</h1>} />

      </Routes>
    </BrowserRouter >
  );
}