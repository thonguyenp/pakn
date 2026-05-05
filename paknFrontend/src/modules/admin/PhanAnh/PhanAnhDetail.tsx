import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { phanAnhApi } from "@/api/admin/phanAnhApi"
import type { PhanAnh } from "@/types/phanAnh"
import dayjs from "dayjs"

export default function PhanAnhDetail() {
  const { maTheoDoi } = useParams()
  const [phanAnh, setPhanAnh] = useState<PhanAnh | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!maTheoDoi) return
        const res = await phanAnhApi.getByMaTheoDoi(maTheoDoi)
        setPhanAnh(res.data.data)

      } catch (err) {
        setError("Không tải được phản ánh")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [maTheoDoi])

  if (loading) return <div className="p-6">Đang tải...</div>

  if (error)
    return <div className="p-6 text-red-500">{error}</div>

  if (!phanAnh)
    return <div className="p-6">Không tìm thấy phản ánh</div>

  return (
    <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chi tiết phản ánh</h1>

        <Link
          to="/admin/phananh"
          className="text-blue-600 hover:underline"
        >
          Quay lại
        </Link>
      </div>

      <div className="space-y-4">

        <div>
          <label className="font-semibold">Tiêu đề</label>
          <div className="mt-1 text-gray-800">{phanAnh.TieuDe}</div>
        </div>

        <div>
          <label className="font-semibold">Nội dung</label>
          <div className="mt-1 whitespace-pre-line text-gray-800">
            {phanAnh.NoiDung}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="font-semibold">Mức độ khẩn cấp</label>
            <div className="mt-1">{phanAnh.MucDoKhanCap}</div>
          </div>

          <div>
            <label className="font-semibold">Ẩn danh</label>
            <div className="mt-1">
              {phanAnh.AnDanh ? "Có" : "Không"}
            </div>
          </div>

          <div>
            <label className="font-semibold">Ngày gửi</label>
            <div className="mt-1">
              {dayjs(phanAnh.NgayGui).format("DD/MM/YYYY HH:mm")}
            </div>
          </div>

          <div>
            <label className="font-semibold">Trạng thái</label>
            <div className="mt-1">
              {phanAnh.trang_thai_phan_anh?.TenTrangThai || "Không rõ"}
            </div>
          </div>

          <div>
            <label className="font-semibold">Lĩnh vực</label>
            <div className="mt-1">{phanAnh.linh_vuc?.TenLinhVuc}</div>
          </div>

          <div>
            <label className="font-semibold">Đơn vị</label>
            <div className="mt-1">{phanAnh.don_vi?.TenDonVi}</div>
          </div>

        </div>
        {/* File đính kèm */}
        <div>
          <label className="font-semibold">File đính kèm</label>

          {(!phanAnh.files || phanAnh.files.length === 0) ? (
            <div className="text-gray-500 mt-1">Không có file</div>
          ) : (
            <div className="space-y-3 mt-2">

              {phanAnh.files.map(file => {

                const fileUrl = file.url;
                return (
                  <div
                    key={file.IdFile}
                    className="flex items-center border rounded-xl p-3 hover:bg-gray-50 transition"
                  >

                    {/* ICON / IMAGE */}
                    {file.LoaiFile.startsWith("image") ? (
                      <img
                        src={fileUrl}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="text-2xl">📄</div>
                    )}

                    {/* FILE NAME */}
                    <div className="ml-3 text-sm font-medium text-gray-700 truncate max-w-[250px]">
                      {file.TenFile}
                    </div>

                    {/* DOWNLOAD */}
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="ml-auto text-gray-500 hover:text-blue-600"
                    >
                      ⬇️
                    </a>

                  </div>
                )
              })}

            </div>
          )}
        </div>
        {/* Xem lịch sử xử lý */}
        <div className="mt-8 flex justify-end">
          <Link
            to={`/admin/phananh/lichsu/${phanAnh.MaTheoDoi}`}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Xem lịch sử xử lý
          </Link>
        </div>
      </div>
    </div>
  )
}