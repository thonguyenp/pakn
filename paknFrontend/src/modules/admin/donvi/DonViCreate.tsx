import { useNavigate } from "react-router-dom";
import DonViForm from "./DonViForm"; // giữ nguyên form cũ của mày
import { donViApi } from "../../../api/donViApi";
import { type DonVi } from "../../../types/donvi";

export default function DonViCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: DonVi) => {
    try {
      await donViApi.create(data);
      alert("Tạo mới thành công!"); // hoặc dùng toast sau
      navigate("/admin/donvi");
    } catch (err) {
      alert("Tạo lỗi!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Thêm đơn vị mới</h2>
      <DonViForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/admin/donvi")}
      />
    </div>
  );
}