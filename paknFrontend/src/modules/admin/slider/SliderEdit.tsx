import { useEffect, useState } from "react"

import {
  getSliders,
  updateSlider,
} from "@/api/admin/sliderApi"

import {
  useNavigate,
  useParams,
} from "react-router-dom"

export default function SliderEdit() {

  const { id } = useParams()

  const navigate = useNavigate()

  const [form, setForm] = useState({
    TieuDe: "",
    MoTa: "",
    Link: "",
    ThuTu: 0,
    NgayBatDau: "",
    NgayKetThuc: "",
  })

  const [image, setImage] =
    useState<File | null>(null)

  const [preview, setPreview] =
    useState("")

  useEffect(() => {

    fetchSlider()

  }, [])

  const fetchSlider = async () => {

    try {

      const res = await getSliders()

      const slider = res.data.find(
        (item) =>
          item.IdSlider === Number(id)
      )

      if (!slider) return

      setPreview(slider.Anh)

      setForm({
        TieuDe: slider.TieuDe || "",
        MoTa: slider.MoTa || "",
        Link: slider.Link || "",
        ThuTu: slider.ThuTu || 0,
        NgayBatDau:
          slider.NgayBatDau?.slice(0, 10) || "",
        NgayKetThuc:
          slider.NgayKetThuc?.slice(0, 10) || "",
      })

    } catch (error) {

      console.error(error)
    }
  }

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault()

    try {

      const formData = new FormData()

      formData.append("TieuDe", form.TieuDe)
      formData.append("MoTa", form.MoTa)
      formData.append("Link", form.Link)

      formData.append(
        "ThuTu",
        String(form.ThuTu)
      )

      formData.append(
        "NgayBatDau",
        form.NgayBatDau
      )

      formData.append(
        "NgayKetThuc",
        form.NgayKetThuc
      )

      if (image) {
        formData.append("Anh", image)
      }

      await updateSlider(
        Number(id),
        formData
      )

      alert("Cập nhật slider thành công")

      navigate("/admin/slider")

    } catch (error: any) {

      console.error(error)

      alert(
        error.response?.data?.message ||
        "Có lỗi xảy ra"
      )
    }
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Cập nhật Slider
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow space-y-4"
      >

        <input
          type="text"
          placeholder="Tiêu đề"
          value={form.TieuDe}
          onChange={(e) =>
            setForm({
              ...form,
              TieuDe: e.target.value,
            })
          }
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Mô tả"
          value={form.MoTa}
          onChange={(e) =>
            setForm({
              ...form,
              MoTa: e.target.value,
            })
          }
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Link"
          value={form.Link}
          onChange={(e) =>
            setForm({
              ...form,
              Link: e.target.value,
            })
          }
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Thứ tự"
          value={form.ThuTu}
          onChange={(e) =>
            setForm({
              ...form,
              ThuTu: Number(e.target.value),
            })
          }
          className="w-full border p-2 rounded"
        />

        <div className="grid grid-cols-2 gap-4">

          <input
            type="date"
            value={form.NgayBatDau}
            onChange={(e) =>
              setForm({
                ...form,
                NgayBatDau: e.target.value,
              })
            }
            className="border p-2 rounded"
          />

          <input
            type="date"
            value={form.NgayKetThuc}
            onChange={(e) =>
              setForm({
                ...form,
                NgayKetThuc: e.target.value,
              })
            }
            className="border p-2 rounded"
          />
        </div>

        {preview && (

          <img
            src={`http://paknproj.test${preview}`}
            alt=""
            className="w-40 rounded"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {

            if (e.target.files?.[0]) {

              setImage(
                e.target.files[0]
              )
            }
          }}
        />

        <button
          type="submit"
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Cập nhật
        </button>
      </form>
    </div>
  )
}