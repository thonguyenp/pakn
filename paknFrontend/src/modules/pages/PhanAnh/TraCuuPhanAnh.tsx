import { useState } from "react"
import { traCuuPhanAnh } from "@/api/user/phanAnhService"
import { useNavigate } from "react-router-dom"
import type { PhanAnh } from "@/types/phanAnh"

const TraCuuPhanAnh = () => {
  const [maTheoDoi, setMaTheoDoi] = useState("")
  const [ngayGui, setNgayGui] = useState("")
  const [data, setData] = useState<PhanAnh | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSearch = async () => {
    setError("")
    setData(null)

    if (!maTheoDoi || !ngayGui) {
      setError("Vui lòng nhập đầy đủ thông tin")
      return
    }

    try {
      setLoading(true)
      const res = await traCuuPhanAnh(maTheoDoi, ngayGui)
      setData(res.data)
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Không tìm thấy phản ánh")
      } else if (err.response?.status === 422) {
        setError("Dữ liệu không hợp lệ")
      } else {
        setError("Có lỗi xảy ra")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Tra cứu phản ánh</h1>

      {/* Form */}
      <div className="bg-white shadow rounded-2xl p-6 space-y-4">
        <input
          type="text"
          placeholder="Mã theo dõi"
          value={maTheoDoi}
          onChange={(e) => setMaTheoDoi(e.target.value)}
          className="w-full border p-3 rounded-xl"
        />

        <input
          type="date"
          value={ngayGui}
          onChange={(e) => setNgayGui(e.target.value)}
          className="w-full border p-3 rounded-xl"
        />

        <button
          onClick={handleSearch}
          className="w-full bg-[#1e54a4] text-white py-3 rounded-xl hover:bg-[#0c4396] transition disabled:bg-gray-400"
        >
          {loading ? "Đang tra cứu..." : "Tra cứu"}
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </div>

      {/* Result */}
      {data && (
        <div className="mt-6 bg-white shadow rounded-2xl p-6 space-y-3">
          <h2 className="text-xl font-semibold">{data.TieuDe}</h2>

          <p><b>Mã theo dõi:</b> {data.MaTheoDoi}</p>
          <p><b>Ngày gửi:</b> {data.NgayGui}</p>
          <p><b>Mức độ:</b> {data.MucDoKhanCap}</p>

          <p><b>Lĩnh vực:</b> {data.linh_vuc?.TenLinhVuc}</p>
          <p><b>Đơn vị:</b> {data.don_vi?.TenDonVi}</p>
          <p><b>Trạng thái:</b> {data.trang_thai_phan_anh?.TenTrangThai}</p>

          <div>
            <b>Nội dung:</b>
            <p className="mt-2 text-gray-700">{data.NoiDung}</p>
          </div>
          <button
            onClick={() =>
              navigate(`/phan-anh/${data.MaTheoDoi}/${new Date(data.NgayGui).toISOString().split('T')[0]}`, {
                state: {
                  ngayGui: data.NgayGui,
                  idTrangThaiPhanAnh: data.IdTrangThaiPhanAnh
                }
              })
            }
            className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
          >
            Chi tiết phản ánh
          </button>
        </div>
      )}
    </div>
  )
}

export default TraCuuPhanAnh