import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Download } from "lucide-react";
import { getPhanAnhChiTiet } from "@/api/user/phanAnhService";
import type { PhanAnh } from "@/types/phanAnh";

const PhanAnhDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState<PhanAnh | null>(null);
  const [loading, setLoading] = useState(true);
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();

    if (!ext) return "📁";

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "🖼️";
    if (["pdf"].includes(ext)) return "📄";
    if (["doc", "docx"].includes(ext)) return "📝";
    if (["xls", "xlsx"].includes(ext)) return "📊";
    if (["zip", "rar"].includes(ext)) return "🗜️";
    if (["mp4", "avi", "mkv"].includes(ext)) return "🎬";
    return "📁";
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        const res = await getPhanAnhChiTiet(Number(id));
        setData(res);
      } catch (error) {
        console.error("Lỗi khi load chi tiết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="p-6">Đang tải...</div>;

  if (!data) return <div className="p-6 text-red-500">Không tìm thấy dữ liệu</div>;

  const getUrgency = (level: number) => {
    switch (level) {
      case 1: return "Thấp";
      case 2: return "Trung bình";
      case 3: return "Cao";
      default: return "Không rõ";
    }
  };

  const getStatus = (status: number) => {
    switch (status) {
      case 1: return "Chờ xử lý";
      case 2: return "Đang xử lý";
      case 3: return "Đã xử lý";
      default: return "Không rõ";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow rounded-2xl p-6 space-y-6">

        {/* Tiêu đề */}
        <div>
          <h1 className="text-2xl font-bold">{data.TieuDe}</h1>
          <p className="text-gray-500 text-sm">
            Ngày gửi: {new Date(data.NgayGui).toLocaleString()}
          </p>
        </div>

        {/* Trạng thái + mức độ */}
        <div className="flex gap-4">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm">
            {getStatus(data.IdTrangThaiPhanAnh)}
          </span>

          <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm">
            {getUrgency(data.MucDoKhanCap)}
          </span>

          {data.AnDanh === 1 && (
            <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-sm">
              Ẩn danh
            </span>
          )}
        </div>

        {/* Nội dung */}
        <div>
          <h2 className="font-semibold mb-2">Nội dung</h2>
          <p className="text-gray-700 whitespace-pre-line">
            {data.NoiDung}
          </p>
        </div>

        {/* File đính kèm */}
        {data.files && data.files.length > 0 && (
          <div>
            <h2 className="font-semibold mb-3">File đính kèm</h2>

            <div className="space-y-3">
              {data.files.map((file, index) => {

                const fileUrl =
                  file.url;

                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 border rounded-xl p-2 hover:bg-gray-50 transition w-fit"                  >

                    {/* LEFT */}
                    <div className="flex items-center gap-3">

                      {/* ICON */}
                      <div className="text-2xl">
                        {getFileIcon(file.TenFile)}
                      </div>

                      {/* FILE NAME */}
                      <div className="text-sm font-medium text-gray-700 truncate max-w-[220px]">
                        {file.TenFile || "Không tên"}
                      </div>

                    </div>

                    {/* RIGHT - DOWNLOAD */}
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="text-gray-500 hover:text-blue-600 transition"
                      title="Tải xuống"
                    >
                      <Download className="w-5 h-5" />
                    </a>

                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhanAnhDetail;