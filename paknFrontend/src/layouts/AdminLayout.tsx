import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";

export default function AdminLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Header */}
        <Header />

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
}