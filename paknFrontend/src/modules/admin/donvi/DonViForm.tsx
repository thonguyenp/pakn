import { useEffect, useState } from "react";
import { type DonVi } from "../../../types/donvi";

interface Props {
  initialData?: DonVi;
  onSubmit: (data: DonVi) => void;
  onCancel: () => void;
}

export default function DonViForm({ initialData, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<DonVi>({
    IdDonVi: 0,
    TenDonVi: "",
    MoTa: "",
    EmailLienHe: "",
    SoDienThoai: "",
    TrangThai: 1,
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "TrangThai" ? Number(value) || 1 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: "24px",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        border: "1px solid #ddd",
        borderRadius: "8px",
        maxWidth: "600px",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: "16px",
        }}
      >
        {/* Tên đơn vị */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            htmlFor="TenDonVi"
            style={{ fontWeight: "bold", marginBottom: "6px" }}
          >
            Tên đơn vị <span style={{ color: "red" }}>*</span>
          </label>
          <input
            id="TenDonVi"
            name="TenDonVi"
            placeholder="Nhập tên đơn vị"
            value={form.TenDonVi || ""}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px",
            }}
          />
        </div>

        {/* Mô tả */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            htmlFor="MoTa"
            style={{ fontWeight: "bold", marginBottom: "6px" }}
          >
            Mô tả
          </label>
          <textarea
            id="MoTa"
            name="MoTa"
            placeholder="Mô tả chi tiết về đơn vị"
            value={form.MoTa || ""}
            onChange={handleChange}
            rows={4}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px",
              resize: "vertical",
            }}
          />
        </div>

        {/* Email liên hệ */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            htmlFor="EmailLienHe"
            style={{ fontWeight: "bold", marginBottom: "6px" }}
          >
            Email liên hệ
          </label>
          <input
            id="EmailLienHe"
            name="EmailLienHe"
            type="email"
            placeholder="example@domain.com"
            value={form.EmailLienHe || ""}
            onChange={handleChange}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px",
            }}
          />
        </div>

        {/* Số điện thoại */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            htmlFor="SoDienThoai"
            style={{ fontWeight: "bold", marginBottom: "6px" }}
          >
            Số điện thoại
          </label>
          <input
            id="SoDienThoai"
            name="SoDienThoai"
            placeholder="0123 456 789"
            value={form.SoDienThoai || ""}
            onChange={handleChange}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px",
            }}
          />
        </div>

        {/* Trạng thái */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            htmlFor="TrangThai"
            style={{ fontWeight: "bold", marginBottom: "6px" }}
          >
            Trạng thái
          </label>
          <input
            id="TrangThai"
            name="TrangThai"
            type="number"
            min={0}
            max={1}
            placeholder="1 = Hoạt động, 0 = Không hoạt động"
            value={form.TrangThai ?? ""}
            onChange={handleChange}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px",
              width: "120px",
            }}
          />
        </div>
      </div>

      {/* Buttons */}
      <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
        <button
          type="submit"
          style={{
            padding: "10px 24px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Lưu
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: "10px 24px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Hủy
        </button>
      </div>
    </form>
  );
}