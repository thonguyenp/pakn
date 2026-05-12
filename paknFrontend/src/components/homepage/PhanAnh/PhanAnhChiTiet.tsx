import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Download } from "lucide-react";
import { createAction, getPhanAnhChiTiet } from "@/api/user/phanAnh/phanAnhService";
import type { PhanAnh } from "@/types/phanAnh";
import PhanHoiList from "./PhanHoiList";
import { actionTransitions } from "@/constants/phanAnh/actionTransitions";
import { actionConfig } from "@/constants/phanAnh/actionConfig";
import type { ActionType } from "@/constants/phanAnh/actionType";

const PhanAnhDetail = () => {
  const { MaTheoDoi } = useParams();
  const [data, setData] = useState<PhanAnh | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentStatus = data?.IdTrangThaiPhanAnh;

  const availableActions = actionTransitions[currentStatus] || [];
  const handleOpenAction = async (action: ActionType) => {
    const config = actionConfig[action];

    if (config.requireForm) {
      navigate(`/phan-hoi/${data?.MaTheoDoi}/${action}`);
      return;
    }

    try {
      await createAction(data!.MaTheoDoi, {
        action,
        NoiDung: "",
        files: [],
      });

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };
  const getUrgency = (value: number) => {
    if (value === 1) return ["Thấp", "bg-gray-100 text-gray-600"];
    if (value === 2) return ["Trung bình", "bg-yellow-100 text-yellow-600"];
    if (value === 3) return ["Cao", "bg-orange-100 text-orange-600"];
    if (value === 4) return ["Khẩn cấp", "bg-red-100 text-red-600"];
    return ["Không rõ", "bg-gray-100 text-gray-500"];
  };

  const phanHoiMoiNhat = data?.phan_hoi
    ?.filter((ph) => ph.LaNoiBo === 0) // nếu cần lọc public
    ?.sort(
      (a, b) =>
        new Date(b.NgayPhanHoi).getTime() -
        new Date(a.NgayPhanHoi).getTime()
    )[0]

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!MaTheoDoi) return;
        const res = await getPhanAnhChiTiet(MaTheoDoi);
        setData(res);
      } catch (error) {
        console.error("Lỗi khi load chi tiết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [MaTheoDoi]);

  if (loading) return <div className="p-6">Đang tải...</div>;

  if (!data) return <div className="p-6 text-red-500">Không tìm thấy dữ liệu</div>;
  const [label, color] = getUrgency(data.IdMucDoKhanCap);
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
            {data.trang_thai_phan_anh?.TenTrangThai}
          </span>

          <span className={`px-3 py-1 rounded-full text-sm ${color}`}>
            {label}
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
          <p className="text-gray-700 whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: data.NoiDung }}>
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
        {/* Các hành động */}
        {/* Cần check lại nếu các trạng thái như nào thì hiển thị các btn ra sao */}
        {/* Phía người dùng */}
        {data.IdTrangThaiPhanAnh === 4 && (
          <button
            onClick={() =>
              navigate(`/phan-anh/cap-nhat/${data.MaTheoDoi}`, {
                state: {
                  ngayGui: data.NgayGui,
                  idTrangThaiPhanAnh: data.IdTrangThaiPhanAnh
                }
              })
            }
            className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
          >
            Bổ sung thông tin
          </button>
        )}
        {/* Phía người xử lý */}
        {availableActions.map((action) => {
          const config = actionConfig[action];
          return (
            <button
              key={action}
              onClick={() => handleOpenAction(action)}
              className={`px-4 py-2 rounded-lg text-white bg-${config.color}-500`}
            >
              {config.button}
            </button>
          );
        })}

      </div>

      {/* PHẢN HỒI */}
      <div>
        <h2 className="font-semibold mb-3">Phản hồi</h2>
        <PhanHoiList
          danhSach={data?.phan_hoi || []}
          phanAnh={data}
          phanHoiMoiNhatId={phanHoiMoiNhat?.IdPhanHoi}
        />
      </div>
    </div>

  );
};

export default PhanAnhDetail;