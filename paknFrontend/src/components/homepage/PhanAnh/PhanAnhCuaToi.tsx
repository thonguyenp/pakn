import { usePhanAnhCuaToi } from "@/hooks/usePhanAnh"
import { useNavigate } from "react-router-dom"

export default function PhanAnhCuaToi() {

  const navigate = useNavigate();
  const {
    data,
    loading,
    page,
    lastPage,
    setPage,
    filter,
    setFilter
  } = usePhanAnhCuaToi()

  if (loading) {
    return <div>Loading...</div>
  }

  return (

    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Phản ánh của tôi</h1>


        <select
          className="border p-2 rounded"
          onChange={e => setFilter({ ...filter, MucDoKhanCap: parseInt(e.target.value) })}
        >
          <option value="">Mức độ</option>
          <option value="THAP">Thấp</option>
          <option value="TRUNG_BINH">Trung bình</option>
          <option value="CAO">Cao</option>
          <option value="KHAN_CAP">Khẩn cấp</option>
        </select>

        <select
          className="border p-2 rounded"
          onChange={e => setFilter({ ...filter, IdTrangThaiPhanAnh: parseInt(e.target.value) })}
        >
          <option value="">Trạng thái</option>
          <option value="1">Đã gửi</option>
          <option value="2">Đang xử lý</option>
          <option value="3">Đã xử lý</option>
        </select>

        <select
          className="border p-2 rounded"
          onChange={e => setFilter({ ...filter, AnDanh: parseInt(e.target.value) })}
        >
          <option value="">Loại</option>
          <option value="1">Ẩn danh</option>
          <option value="0">Không ẩn danh</option>
        </select>

      </div>


      <div className="space-y-4 mb-6">

        {data.map(pa => (

          <div
            key={pa.IdPhanAnh}
            className="border rounded-lg p-4 hover:shadow"
          >

            <div className="flex justify-between mb-2">

              <h2 className="font-semibold text-lg">
                {pa.TieuDe}
              </h2>

              <span className="text-sm text-gray-500">
                {pa.NgayGui}
              </span>

            </div>

            <p className="text-gray-700">
              {pa.NoiDung}
            </p>
                        {/* ACTION */}
            <div className="flex justify-end">
              <button
                onClick={() => navigate(`/phan-anh/${pa.IdPhanAnh}`)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Xem chi tiết
              </button>
            </div>

          </div>

        ))}

      </div>


      <div className="flex gap-2">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded"
        >
          Prev
        </button>

        <span className="px-3 py-1">
          {page} / {lastPage}
        </span>

        <button
          disabled={page === lastPage}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>

      </div>

    </div>

  )
}