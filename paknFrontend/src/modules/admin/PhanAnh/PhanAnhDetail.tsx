import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { phanAnhApi } from "@/api/admin/phanAnhApi"
import type { PhanAnh } from "@/types/phanAnh"

export default function PhanAnhDetail() {
  const { id } = useParams()
  const [phanAnh, setPhanAnh] = useState<PhanAnh | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return
        const res = await phanAnhApi.getById(Number(id))
        setPhanAnh(res.data)

      } catch (err) {
        setError("Không tải được phản ánh")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

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
              {new Date(phanAnh.NgayGui).toLocaleString()}
            </div>
          </div>

          <div>
            <label className="font-semibold">Trạng thái</label>
            <div className="mt-1">
              {phanAnh.IdTrangThaiPhanAnh}
            </div>
          </div>

          <div>
            <label className="font-semibold">Lĩnh vực</label>
            <div className="mt-1">{phanAnh.IdLinhVuc}</div>
          </div>

          <div>
            <label className="font-semibold">Đơn vị</label>
            <div className="mt-1">{phanAnh.IdDonVi}</div>
          </div>

        </div>
        <div>
          <label className="font-semibold">File đính kèm</label>

          {files.length === 0 ? (
            <div className="text-gray-500 mt-1">Không có file</div>
          ) : (
            <div className="grid grid-cols-3 gap-3 mt-2">

              {files.map(file => (
                <div
                  key={file.IdFile}
                  className="border rounded p-2 flex flex-col items-center"
                >

                  {file.LoaiFile.startsWith("image") ? (
                    <img
                      src={file.url}
                      className="h-24 object-cover rounded"
                    />
                  ) : (
                    <i className="fa-solid fa-file text-3xl text-gray-500"></i>
                  )}

                  <a
                    href={file.url}
                    target="_blank"
                    className="text-blue-600 text-sm mt-2 hover:underline"
                  >
                    {file.TenFile}
                  </a>

                </div>
              ))}

            </div>
          )}
        </div>
      </div>
    </div>
  )
}