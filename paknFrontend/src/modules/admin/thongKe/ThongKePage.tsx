import { useEffect, useState } from "react"

import {
  getThongKeTongQuan,
  type TongQuanResponse
} from "@/api/admin/thongKeApi"

import ThongKeCard from "@/components/admin/ThongKeCard"

const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0]
}

const ThongKePage = () => {

  const today = new Date()

  const firstDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  )

  const [from, setFrom] = useState(
    formatDate(firstDay)
  )

  const [to, setTo] = useState(
    formatDate(today)
  )

  const [loading, setLoading] = useState(false)

  const [data, setData] =
    useState<TongQuanResponse | null>(null)

  const fetchThongKe = async () => {

    try {

      setLoading(true)

      const response =
        await getThongKeTongQuan(from, to)

      setData(response)

    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false)
    }
  }

  useEffect(() => {

    fetchThongKe()

  }, [])

  return (
    <div className="p-6 space-y-6">

      <div>
        <h1 className="text-2xl font-bold">
          Thống kê phản ánh kiến nghị
        </h1>
      </div>

      <div className="bg-white border rounded-xl p-4 shadow-sm">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div>
            <label className="block mb-1 text-sm font-medium">
              Từ ngày
            </label>

            <input
              type="date"
              value={from}
              onChange={(e) =>
                setFrom(e.target.value)
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Đến ngày
            </label>

            <input
              type="date"
              value={to}
              onChange={(e) =>
                setTo(e.target.value)
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex items-end">

            <button
              onClick={fetchThongKe}
              className="
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-4
                py-2
                rounded-lg
              "
            >
              Thống kê
            </button>

          </div>

        </div>

      </div>

      {
        loading
          ? (
            <div className="text-center py-10">
              Đang tải dữ liệu...
            </div>
          )
          : (
            <>
              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  lg:grid-cols-3
                  xl:grid-cols-6
                  gap-4
                "
              >

                <ThongKeCard
                  title="Tổng phản ánh"
                  value={
                    data?.tong_quan.tong_phan_anh || 0
                  }
                  color="text-purple-500"
                />

                <ThongKeCard
                  title="Chưa xử lý"
                  value={
                    data?.tong_quan.chua_xu_ly || 0
                  }
                  color="text-yellow-600"
                />

                <ThongKeCard
                  title="Đang xử lý"
                  value={
                    data?.tong_quan.dang_xu_ly || 0
                  }
                  color="text-blue-600"
                />

                <ThongKeCard
                  title="Đã hoàn thành"
                  value={
                    data?.tong_quan.da_hoan_thanh || 0
                  }
                  color="text-green-600"
                />

                <ThongKeCard
                  title="Quá hạn"
                  value={
                    data?.tong_quan.qua_han || 0
                  }
                  color="text-red-600"
                />

                <ThongKeCard
                  title="Kịp hạn"
                  value={
                    data?.tong_quan.kip_han || 0
                  }
                  color="text-emerald-600"
                />
              </div>

              <div
                className="
                  bg-white
                  border
                  rounded-xl
                  shadow-sm
                  overflow-hidden
                "
              >

                <div className="p-4 border-b">

                  <h2 className="font-semibold text-lg">
                    Thống kê theo đơn vị
                  </h2>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full text-sm">

                    <thead className="bg-gray-100">

                      <tr>

                        <th className="px-4 py-3 text-left">
                          Đơn vị
                        </th>

                        <th className="px-4 py-3 text-center">
                          Tổng
                        </th>

                        <th className="px-4 py-3 text-center">
                          Chưa xử lý
                        </th>

                        <th className="px-4 py-3 text-center">
                          Đang xử lý
                        </th>

                        <th className="px-4 py-3 text-center">
                          Hoàn thành
                        </th>

                        <th className="px-4 py-3 text-center">
                          Quá hạn
                        </th>

                        <th className="px-4 py-3 text-center">
                          Kịp hạn
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {
                        data?.theo_don_vi.map((item) => (

                          <tr
                            key={item.IdDonVi}
                            className="
                              border-t
                              hover:bg-gray-50
                            "
                          >

                            <td className="px-4 py-3 font-medium">
                              {item.TenDonVi}
                            </td>

                            <td className="px-4 py-3 text-center">
                              {item.tong_phan_anh}
                            </td>

                            <td
                              className="
                                px-4
                                py-3
                                text-center
                                text-yellow-600
                                font-medium
                              "
                            >
                              {item.chua_xu_ly}
                            </td>

                            <td
                              className="
                                px-4
                                py-3
                                text-center
                                text-blue-600
                                font-medium
                              "
                            >
                              {item.dang_xu_ly}
                            </td>

                            <td
                              className="
                                px-4
                                py-3
                                text-center
                                text-green-600
                                font-medium
                              "
                            >
                              {item.da_hoan_thanh}
                            </td>

                            <td
                              className="
                                px-4
                                py-3
                                text-center
                                text-red-600
                                font-medium
                              "
                            >
                              {item.qua_han}
                            </td>

                            <td
                              className="
                                px-4
                                py-3
                                text-center
                                text-emerald-600
                                font-medium
                              "
                            >
                              {item.kip_han}
                            </td>

                          </tr>
                        ))
                      }

                    </tbody>

                  </table>

                </div>

              </div>
            </>
          )
      }

    </div>
  )
}
export default ThongKePage