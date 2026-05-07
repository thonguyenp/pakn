import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { phanAnhApi } from "@/api/admin/phanAnhApi"
import { type LichSuXuLy, type PhanHoi } from "@/types/lichSuXuLy"
import dayjs from "dayjs"

const LichSuPhanAnh = () => {
  const { maTheoDoi } = useParams()

  const [lichSu, setLichSu] = useState<LichSuXuLy[]>([])
  const [phanHoi, setPhanHoi] = useState<PhanHoi[]>([])
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchData = async (pageNumber = 1) => {
    if (!maTheoDoi) return

    try {
      setLoading(true)

      const res = await phanAnhApi.getLichSu(maTheoDoi, pageNumber)

      setLichSu(res.data.data || [])
      setPhanHoi([]) // hiện tại API chưa trả phản hồi
      setPagination(res.data.pagination || null)
    } catch (error) {
      console.error("Lỗi load lịch sử:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [page, maTheoDoi])

  if (!maTheoDoi) {
    return <div className="text-center mt-10">Không tìm thấy mã theo dõi</div>
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Lịch sử xử lý phản ánh
      </h1>

      {loading && (
        <div className="text-center py-10 text-gray-500">
          Đang tải dữ liệu...
        </div>
      )}

      {!loading && lichSu.length === 0 && phanHoi.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          Không có dữ liệu
        </div>
      )}

      <div className="space-y-6">
        {lichSu.map((item) => (
          <div
            key={item.IdLichSuXuLy}
            className="border rounded-xl p-4 shadow-sm bg-white"
          >
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-blue-600">
                {item.HanhDong}
              </span>
              <span className="text-sm text-gray-400">
                {dayjs(item.ThoiGian).format("DD/MM/YYYY HH:mm")}
              </span>
            </div>

            <p className="text-gray-700 mb-2">{item.GhiChu}</p>

            <div className="text-sm text-gray-500">
              Người xử lý: {item.nguoi_dung?.HoTen || "Không rõ"}
                          </div>
          </div>
        ))}

        {phanHoi.map((item) => (
          <div
            key={item.IdPhanHoi}
            className="border rounded-xl p-4 shadow-sm bg-green-50"
          >
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-green-600">
                Phản hồi
              </span>
              <span className="text-sm text-gray-400">
                {dayjs(item.NgayPhanHoi).format("DD/MM/YYYY HH:mm")}
              </span>
            </div>

            <p>{item.NoiDung}</p>
          </div>
        ))}
      </div>

      {pagination && (
        <div className="flex justify-center gap-4 mt-8">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>

          <span>
            {pagination.current_page} / {pagination.last_page}
          </span>

          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.last_page}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default LichSuPhanAnh