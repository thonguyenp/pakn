import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getPhanAnhPublic } from "@/api/user/phanAnh/phanAnhService"
import type { PhanAnh } from "@/types/phanAnh"
import PhanHoiList from "@/components/homepage/PhanAnh/PhanHoiList"
import { Download } from "lucide-react"

const PhanAnhPublicPage = () => {
  const navigate = useNavigate()
  const { maTheoDoi, ngayGui } = useParams()

  const [data, setData] = useState<PhanAnh | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const getUrgency = (value: number) => {
    if (value == 1) return ["Thấp", "bg-gray-100 text-gray-600"];
    if (value == 2) return ["Trung bình", "bg-yellow-100 text-yellow-600"];
    if (value == 3) return ["Cao", "bg-orange-100 text-orange-600"];
    if (value == 4) return ["Khẩn cấp", "bg-red-100 text-red-600"];
    return ["Không rõ", "bg-gray-100 text-gray-500"];
  };
  const [label, color] = getUrgency(data?.IdMucDoKhanCap || 0)
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
        if (!maTheoDoi || !ngayGui) return

        const res = await getPhanAnhPublic(maTheoDoi, ngayGui)
        setData(res)
      } catch (err: any) {
        setError(err.response?.data?.message || "Có lỗi xảy ra")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [maTheoDoi, ngayGui])

  if (loading) return <div className="p-6">Đang tải...</div>
  if (error) return <div className="p-6 text-red-500">{error}</div>
  if (!data) return null

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
        <div className="flex flex-wrap gap-3">

          {/* Trạng thái */}
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm">
            {data.trang_thai_phan_anh?.TenTrangThai}
          </span>

          {/* Mức độ khẩn cấp */}
          <span className={`px-3 py-1 rounded-full text-sm ${color}`}>
            {label}
          </span>

          {/* Ẩn danh */}
          {data.AnDanh === 1 && (
            <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-sm">
              Ẩn danh
            </span>
          )}

          {/* Trễ hạn / Kịp hạn */}
          {data.qua_han ? (
            <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-medium">
              ⏰ Trễ hạn
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm font-medium">
              ✔ Kịp hạn
            </span>
          )}
        </div>

        {/* DEADLINE */}
        <div className="text-sm text-gray-500">
          Deadline xử lý:{" "}
          {data.deadline
            ? new Date(data.deadline).toLocaleString("vi-VN")
            : "Không có"}
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
        <div className="flex justify-end">
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


        </div>
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
      {/* ĐÁNH GIÁ */}

    </div>
  )
}

export default PhanAnhPublicPage