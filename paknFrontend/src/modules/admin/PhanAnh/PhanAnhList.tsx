import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { type PhanAnh } from "@/types/phanAnh"
import { getPhanAnhList } from "@/api/admin/phanAnhApi"
import { type Pagination } from "@/types/pagination"
import type { LinhVuc } from "@/types/linhvuc"
import type { DonVi } from "@/types/donvi"
import type { TrangThaiPhanAnh } from "@/types/trangThaiPhanAnh"
import { getMeta } from "@/api/meta/metaService"
import SearchInput from "@/components/shared/SearchInput"
import ToggleSwitch from "@/components/shared/ToogleSwitch"

export default function PhanAnhList() {
  const [data, setData] = useState<Pagination<PhanAnh>>()
  const [keyword, setKeyword] = useState("")
  const [anDanh, setAnDanh] = useState<number | undefined>()
  const [linhVuc, setLinhVuc] = useState<number | undefined>()
  const [donVi, setDonVi] = useState<number | undefined>()
  const [trangThai, setTrangThai] = useState<number | undefined>()
  const [page, setPage] = useState(1)

  const [dsLinhVuc, setDsLinhVuc] = useState<LinhVuc[]>([])
  const [dsDonVi, setDsDonVi] = useState<DonVi[]>([])
  const [dsTrangThai, setDsTrangThai] = useState<TrangThaiPhanAnh[]>([])


  const fetchData = async () => {
    const res = await getPhanAnhList({
      keyword,
      AnDanh: anDanh,
      IdLinhVuc: linhVuc,
      IdDonVi: donVi,
      IdTrangThaiPhanAnh: trangThai,
      page,
    })

    setData(res)
  }

  const fetchMeta = async () => {
    const meta = await getMeta("linhvuc,donvi,trangthai")

    setDsLinhVuc(meta.linhvuc)
    setDsDonVi(meta.donvi)
    setDsTrangThai(meta.trangthai)
  }
  useEffect(() => {
    fetchMeta()
  }, [])

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchData()
    }, 500)

    return () => clearTimeout(delay)
  }, [keyword, anDanh, linhVuc, donVi, trangThai, page])

  return (
    <div className="p-6 space-y-4">

      {/* Search */}
      <SearchInput
        value={keyword}
        onChange={setKeyword}
        placeholder="Tìm kiếm tiêu đề hoặc nội dung..."
      />
      {/* Filter */}
      <div className="flex gap-4">

        {/* <label className="flex items-center gap-2">
          <input
            type="checkbox"
            onChange={(e) => setAnDanh(e.target.checked ? 1 : undefined)}
          />
          Ẩn danh
        </label> */}
        <ToggleSwitch
          label="Ẩn danh"
          checked={anDanh === 1}
          onChange={(checked) => setAnDanh(checked ? 1 : undefined)}
        ></ToggleSwitch>
        {/* Trạng thái */}
        <select
          className="border p-2"
          onChange={(e) =>
            setTrangThai(Number(e.target.value) || undefined)
          }
        >
          <option value="">Trạng thái</option>
          {dsTrangThai.map((tt) => (
            <option key={tt.IdTrangThaiPhanAnh} value={tt.IdTrangThaiPhanAnh}>
              {tt.TenTrangThai}
            </option>
          ))}
        </select>
        {/* Lĩnh vực */}
        <select
          className="border p-2"
          value={linhVuc ?? ""}
          onChange={(e) =>
            setLinhVuc(Number(e.target.value) || undefined)
          }
        >
          <option value="">Lĩnh vực</option>
          {dsLinhVuc.map((lv) => (
            <option key={lv.IdLinhVuc} value={lv.IdLinhVuc}>
              {lv.TenLinhVuc}
            </option>
          ))}
        </select>
        {/* Đơn vị */}
        <select
          className="border p-2"
          value={donVi ?? ""}
          onChange={(e) =>
            setDonVi(Number(e.target.value) || undefined)
          }
        >
          <option value="">Đơn vị</option>
          {dsDonVi.map((dv) => (
            <option key={dv.IdDonVi} value={dv.IdDonVi}>
              {dv.TenDonVi}
            </option>
          ))}
        </select>

      </div>

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Tiêu đề</th>
            <th>Nội dung</th>
            <th>Ẩn danh</th>
            <th>Ngày gửi</th>
            <th className="p-2 text-center">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {data?.data.map((item) => (
            <tr key={item.IdPhanAnh} className="border-t">
              <td className="p-2">{item.TieuDe}</td>
              <td>{item.NoiDung}</td>
              <td>{item.AnDanh ? "Có" : "Không"}</td>
              <td>{item.NgayGui}</td>
              <td className="p-2">
                <div className="flex gap-2 justify-center">

                  <Link
                    to={`/admin/phananh/xem/${item.MaTheoDoi}`}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Xem
                  </Link>

                  <Link
                    to={`/admin/phananh/edit/${item.IdPhanAnh}`}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Sửa
                  </Link>

                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex gap-2">
        {Array.from({ length: data?.last_page || 0 }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 border ${page === i + 1 ? "bg-blue-500 text-white" : ""
              }`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

    </div>
  )
}