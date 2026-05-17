import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import {
  deleteSlider,
  getSliders,
  type Slider,
} from "@/api/admin/sliderApi"

export default function SliderPage() {

  const [sliders, setSliders] = useState<Slider[]>([])

  const [loading, setLoading] = useState(false)

  const fetchSliders = async () => {

    try {

      setLoading(true)

      const res = await getSliders()

      setSliders(res.data)

    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSliders()
  }, [])

  const handleDelete = async (
    id: number
  ) => {

    const confirmDelete = confirm(
      "Bạn có chắc muốn ẩn slider này?"
    )

    if (!confirmDelete) return

    try {

      await deleteSlider(id)

      alert("Ẩn slider thành công")

      fetchSliders()

    } catch (error) {

      console.error(error)
    }
  }

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">
          Quản lý Slider
        </h1>

        <Link
          to="/admin/slider/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Thêm slider
        </Link>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">

        <table className="w-full border-collapse">

          <thead className="bg-gray-100">

            <tr>

              <th className="border p-2">
                ID
              </th>

              <th className="border p-2">
                Ảnh
              </th>

              <th className="border p-2">
                Tiêu đề
              </th>

              <th className="border p-2">
                Thứ tự
              </th>

              <th className="border p-2">
                Trạng thái
              </th>

              <th className="border p-2">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan={6}
                  className="text-center p-4"
                >
                  Đang tải...
                </td>
              </tr>

            ) : sliders.length === 0 ? (

              <tr>
                <td
                  colSpan={6}
                  className="text-center p-4"
                >
                  Không có slider
                </td>
              </tr>

            ) : (

              sliders.map((slider) => (

                <tr key={slider.IdSlider}>

                  <td className="border p-2 text-center">
                    {slider.IdSlider}
                  </td>

                  <td className="border p-2">

                    <img
                      src={`http://paknproj.test${slider.Anh}`}
                      alt=""
                      className="w-32 h-20 object-cover rounded"
                    />
                  </td>

                  <td className="border p-2">
                    {slider.TieuDe}
                  </td>

                  <td className="border p-2 text-center">
                    {slider.ThuTu}
                  </td>

                  <td className="border p-2 text-center">

                    {slider.TrangThai === 1
                      ? "Hiển thị"
                      : "Ẩn"}
                  </td>

                  <td className="border p-2">

                    <div className="flex gap-2 justify-center">

                      <Link
                        to={`/admin/slider/edit/${slider.IdSlider}`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Sửa
                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(
                            slider.IdSlider
                          )
                        }
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Ẩn
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}