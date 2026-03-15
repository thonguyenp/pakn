import { usePhanAnhCuaToi } from "@/hooks/usePhanAnh"

export default function PhanAnhCuaToi() {

  const { data, loading } = usePhanAnhCuaToi()

  if (loading) return <p>Đang tải...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Phản ánh của tôi</h1>

      <div className="space-y-4">
        {data.map((pa) => (
          <div
            key={pa.IdPhanAnh}
            className="border rounded-lg p-4 shadow"
          >
            <h2 className="font-semibold text-lg">
              {pa.TieuDe}
            </h2>

            <p className="text-gray-600 mt-2">
              {pa.NoiDung}
            </p>

            <p className="text-sm mt-2">
              Ngày gửi: {pa.NgayGui}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}