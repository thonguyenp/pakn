import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DonViForm from "./DonViForm";
import { donViApi } from "@/api/admin/donViApi";
import { type DonVi } from "../../../types/donvi";

export default function DonViEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<DonVi | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const res = await donViApi.getById(Number(id));
        setInitialData(res.data);
      } catch (err) {
        alert("Không tìm thấy đơn vị!");
        navigate("/admin/donvi");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (data: DonVi) => {
    if (!data.IdDonVi) return;
    try {
      await donViApi.update(data.IdDonVi!, data);
      alert("Cập nhật thành công!");
      navigate("/admin/donvi");
    } catch (err) {
      alert("Update lỗi!");
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sửa đơn vị: {initialData?.TenDonVi}</h2>
      <DonViForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/admin/donvi")}
      />
    </div>
  );
}