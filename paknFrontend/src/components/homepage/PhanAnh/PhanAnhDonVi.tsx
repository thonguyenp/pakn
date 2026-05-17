import ToggleSwitch from "@/components/shared/ToogleSwitch"
import { usePhanAnhDonVi } from "@/hooks/usePhanAnh"
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { getMeta } from "@/api/meta/metaService";

import type { TrangThaiPhanAnh } from "@/types/trangThaiPhanAnh";
import type { MucDoKhanCap } from "@/types/mucDoKhanCap";

export default function PhanAnhDonVi() {

  const navigate = useNavigate();

  const {
    data,
    loading,
    page,
    lastPage,
    setPage,
    filter,
    setFilter
  } = usePhanAnhDonVi()

  const [mucDoList, setMucDoList] = useState<MucDoKhanCap[]>([])
  const [trangThaiList, setTrangThaiList] = useState<TrangThaiPhanAnh[]>([])

  useEffect(() => {

    const fetchMeta = async () => {

      try {

        const res = await getMeta("mucdokhancap,trangthai")

        setMucDoList(res.mucdokhancap || [])
        setTrangThaiList(res.trangthai || [])

      } catch (error) {
        console.error(error)
      }

    }

    fetchMeta()

  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (

    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">
          Phản ánh đơn vị
        </h1>

        {/* MỨC ĐỘ KHẨN CẤP */}
        <select
          className="border p-2 rounded"
          value={filter.MucDoKhanCap || ""}
          onChange={(e) => {

            const value = e.target.value

            setFilter({
              ...filter,
              MucDoKhanCap: value ? parseInt(value) : undefined
            })

          }}
        >

          <option value="">
            Mức độ
          </option>

          {mucDoList.map((item) => (

            <option
              key={item.IdMucDoKhanCap}
              value={item.IdMucDoKhanCap}
            >
              {item.TenMucDo}
            </option>

          ))}

        </select>

        {/* TRẠNG THÁI */}
        <select
          className="border p-2 rounded"
          value={filter.IdTrangThaiPhanAnh || ""}
          onChange={(e) => {

            const value = e.target.value

            setFilter({
              ...filter,
              IdTrangThaiPhanAnh: value
                ? parseInt(value)
                : undefined
            })

          }}
        >

          <option value="">
            Trạng thái
          </option>

          {trangThaiList.map((item) => (

            <option
              key={item.IdTrangThaiPhanAnh}
              value={item.IdTrangThaiPhanAnh}
            >
              {item.TenTrangThai}
            </option>

          ))}

        </select>

        <ToggleSwitch
          checked={filter.AnDanh === 1}
          onChange={(checked) => {

            if (checked) {

              setFilter({
                ...filter,
                AnDanh: 1
              })

            } else {

              const { AnDanh, ...rest } = filter
              setFilter(rest)

            }

          }}
          label="Ẩn danh"
        />
        <ToggleSwitch
          checked={filter.near_deadline === true}
          onChange={(checked) => {

            if (checked) {

              setFilter({
                ...filter,
                near_deadline: true
              })

            } else {

              const { near_deadline, ...rest } = filter
              setFilter(rest)

            }

          }}
          label="Sát deadline"
        />
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
                {dayjs(pa.NgayGui).format("DD/MM/YYYY HH:mm")}
              </span>

            </div>

            <p
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: pa.NoiDung }}
            />

            <div className="flex justify-end">

              <button
                onClick={() => navigate(`/phan-anh/${pa.MaTheoDoi}`)}
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
          className="px-3 py-1 border rounded bg-[#E6F0FF] text-[#0C4396] hover:bg-[#D0E4FF] disabled:bg-gray-200 disabled:text-gray-400"
        >
          Prev
        </button>

        <span className="px-3 py-1">
          {page} / {lastPage}
        </span>

        <button
          disabled={page === lastPage}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded bg-[#E6F0FF] text-[#0C4396] hover:bg-[#D0E4FF] disabled:bg-gray-200 disabled:text-gray-400"
        >
          Next
        </button>

      </div>

    </div>

  )
}