import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createPhanHoi } from "@/api/user/phanHoiService";
import { getPhanAnhChiTiet } from "@/api/user/phanAnhService";

const PhanHoiCreate = () => {
  const { maTheoDoi } = useParams();
  const navigate = useNavigate();

  const [noiDung, setNoiDung] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const [idPhanAnh, setIdPhanAnh] = useState<number | null>(null);

  // 🔥 Lấy IdPhanAnh từ MaTheoDoi
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!maTheoDoi) return;

        const res = await getPhanAnhChiTiet(maTheoDoi);
        setIdPhanAnh(res.IdPhanAnh);

      } catch (error) {
        console.error("Không lấy được phản ánh", error);
      }
    };

    fetchData();
  }, [maTheoDoi]);

  const handleSubmit = async () => {
    if (!noiDung.trim()) {
      alert("Vui lòng nhập nội dung");
      return;
    }

    if (!idPhanAnh) {
      alert("Không tìm thấy phản ánh");
      return;
    }

    try {
      setLoading(true);

      await createPhanHoi({
        NoiDung: noiDung,
        IdPhanAnh: idPhanAnh,
        files: files,
      });

      alert("Phản hồi thành công");

      // quay lại trang detail
      navigate(`/phan-anh/${maTheoDoi}`);

    } catch (error) {
      console.error(error);
      alert("Lỗi khi gửi phản hồi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white p-6 rounded-2xl shadow space-y-4">

        <h1 className="text-xl font-bold">
          Gửi phản hồi - #{maTheoDoi}
        </h1>

        {/* Nội dung */}
        <textarea
          value={noiDung}
          onChange={(e) => setNoiDung(e.target.value)}
          placeholder="Nhập nội dung phản hồi..."
          className="w-full border rounded-xl p-3 h-32"
        />

        {/* Upload */}
        <input
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              setFiles(Array.from(e.target.files));
            }
          }}
        />

        {/* Preview */}
        {files.map((file, i) => (
          <div key={i} className="text-sm text-gray-600">
            {file.name}
          </div>
        ))}

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !idPhanAnh}
          className="px-4 py-2 bg-green-600 text-white rounded-xl"
        >
          {loading ? "Đang gửi..." : "Gửi phản hồi"}
        </button>

      </div>
    </div>
  );
};

export default PhanHoiCreate;