import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { type DonVi } from "../../../types/donvi";
import { donViApi } from "../../../api/donViApi";
import type { Pagination } from "../../../types/pagination";  // import type này

export default function DonViList() {
  const [list, setList] = useState<DonVi[]>([]);
  const [pagination, setPagination] = useState<Pagination<DonVi> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const loadData = async (page: number) => {
    try {
      const res = await donViApi.getAll(page);
      setPagination(res.data);
      setList(res.data.data || []);
      setCurrentPage(page);
    } catch (err) {
      console.error("Load đơn vị lỗi:", err);
    }
  };

  useEffect(() => {
    loadData(1);  // load trang 1 đầu tiên
  }, []);

  const remove = async (id?: number) => {
    if (!id) return;
    if (!window.confirm("Xóa đơn vị?")) return;
    try {
      await donViApi.delete(id);
      loadData(currentPage);  // reload trang hiện tại sau xóa
    } catch (err) {
      alert("Xóa lỗi!");
    }
  };

  // Hàm chuyển trang
  const goToPage = (page: number) => {
    if (page < 1 || (pagination && page > pagination.last_page)) return;
    loadData(page);
  };

  return (
  <div style={{ 
    height: "100%",             // full height của main
    width: "100%",              // full width
    padding: "20px",
    boxSizing: "border-box",    // padding không làm tràn
  }}>
    <h2 style={{ margin: "0 0 20px 0", fontSize: "1.75rem" }}>Quản lý đơn vị</h2>

    <Link to="/admin/donvi/create">
      <button style={{ 
        padding: "10px 20px", 
        background: "#4caf50", 
        color: "white", 
        border: "none", 
        borderRadius: "4px",
        marginBottom: "20px",
        fontSize: "1rem",
        cursor: "pointer"
      }}>
        + Thêm đơn vị mới
      </button>
    </Link>

    {/* Bảng: full width, scroll ngang nếu cần */}
    <div style={{ overflowX: "auto", marginBottom: "20px" }}>
      <table
        border={1}
        cellPadding={10}
        style={{ 
          width: "100%", 
          minWidth: "1000px",       // tránh co quá nhỏ, buộc scroll ngang nếu màn hình hẹp
          borderCollapse: "collapse",
          backgroundColor: "white",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          borderRadius: "8px",
          overflow: "hidden"
        }}
      >
        <thead>
          <tr style={{ background: "#f0f0f0", fontWeight: "bold" }}>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Điện thoại</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {list.map((d) => (
            <tr key={d.IdDonVi} style={{ borderBottom: "1px solid #eee" }}>
              <td>{d.IdDonVi}</td>
              <td>{d.TenDonVi}</td>
              <td>{d.EmailLienHe}</td>
              <td>{d.SoDienThoai}</td>
              <td>{d.TrangThai === 1 ? "Hoạt động" : "Ẩn"}</td>
              <td>
                <button
                  onClick={() => navigate(`/admin/donvi/${d.IdDonVi}/edit`)}
                  style={{ 
                    marginRight: "8px", 
                    padding: "6px 12px",
                    background: "#2196f3", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Sửa
                </button>
                <button
                  onClick={() => remove(d.IdDonVi)}
                  style={{ 
                    padding: "6px 12px",
                    background: "#f44336", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Phân trang */}
    {pagination && (
      <div style={{ 
        marginTop: "20px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        fontSize: "14px",
        padding: "10px 0"
      }}>
        <div>
          Hiển thị {pagination.from || 0} - {pagination.to || 0} / {pagination.total} bản ghi
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: "8px 16px",
              background: currentPage === 1 ? "#ccc" : "#2196f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              minWidth: "80px"
            }}
          >
            Prev
          </button>

          <span>Trang {currentPage} / {pagination.last_page}</span>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === pagination.last_page}
            style={{
              padding: "8px 16px",
              background: currentPage === pagination.last_page ? "#ccc" : "#2196f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: currentPage === pagination.last_page ? "not-allowed" : "pointer",
              minWidth: "80px"
            }}
          >
            Next
          </button>
        </div>
      </div>
    )}

    {list.length === 0 && !pagination && <p style={{ marginTop: "40px", textAlign: "center", fontSize: "1.2rem", color: "#666" }}>Chưa có đơn vị nào!.</p>}
  </div>
);
}