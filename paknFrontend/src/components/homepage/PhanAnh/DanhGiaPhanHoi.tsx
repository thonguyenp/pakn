import { useEffect, useState } from "react"
import { danhGiaApi } from "@/api/user/phanAnh/danhGiaApi"
import { type DanhGia } from "@/types/danhGia"

interface Props {
  idPhanHoi: number
  chiChoDanhGia?: boolean
}


export default function DanhGiaPhanHoi({ idPhanHoi, chiChoDanhGia }: Props) {
  const [list, setList] = useState<DanhGia[]>([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [daDanhGia, setDaDanhGia] = useState(false)

  // load danh sách
  const fetchData = async () => {
    try {
      const res = await danhGiaApi.getByPhanHoi(idPhanHoi)

      setList(res.data.list)
      setDaDanhGia(res.data.daDanhGia)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [idPhanHoi])

  // submit
  const handleSubmit = async () => {
    setLoading(true)
    setError("")

    try {
      await danhGiaApi.create({
        MucDoHaiLong: rating,
        NhanXet: comment,
        IdPhanHoi: idPhanHoi,
      })

      setComment("")
      setRating(5)
      setDaDanhGia(true)

      fetchData()
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6 p-4 border rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-3">Đánh giá phản hồi</h2>

      {/* LIST */}
      <div className="space-y-2 mb-4">
        {list.map((item) => (
          <div key={item.IdDanhGiaPhanHoi} className="p-2 border rounded">
            <div className="text-yellow-500">
              {"★".repeat(item.MucDoHaiLong)}
            </div>
            <div>{item.NhanXet}</div>
            <div className="text-sm text-gray-500">
              {item.nguoi_dung?.HoTen}
            </div>
          </div>
        ))}
      </div>

      {/* FORM */}
      {chiChoDanhGia && !daDanhGia && (
        <div className="space-y-3">
          <div>
            <label>Chọn mức độ hài lòng:</label>
            <div className="flex gap-2 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  className={`text-2xl ${rating >= s ? "text-yellow-500" : "text-gray-300"
                    }`}
                  onClick={() => setRating(s)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <textarea
            className="w-full border p-2 rounded"
            placeholder="Nhận xét..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          {error && <div className="text-red-500">{error}</div>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </div>
      )}

      {daDanhGia && (
        <div className="text-green-600 font-medium">
          Bạn đã đánh giá phản hồi này
        </div>
      )}
    </div>
  )
}