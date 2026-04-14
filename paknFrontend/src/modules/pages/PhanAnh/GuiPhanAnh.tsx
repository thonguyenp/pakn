import { useEffect, useState } from "react"
import { guiPhanAnh } from "@/api/user/phanAnhService"
import { getMeta } from "@/api/meta/metaService"

import ToggleSwitch from "@/components/shared/ToogleSwitch"
import FileDropzone from "@/components/shared/FileDropzone"

import { type LinhVuc } from "@/types/linhvuc"
import { type DonVi } from "@/types/donvi"
import SuccessModal from "@/components/shared/SuccessModal"
import SelectSearchDropdown from "@/components/shared/SelectSearchDropdown"


const GuiPhanAnh = () => {

  const [tieuDe, setTieuDe] = useState("")
  const [noiDung, setNoiDung] = useState("")

  const [linhVuc, setLinhVuc] = useState("")
  const [donVi, setDonVi] = useState("")
  
  const [mucDoKhanCap, setMucDoKhanCap] = useState("THAP")

  const [anDanh, setAnDanh] = useState(false)

  const [files, setFiles] = useState<File[]>([])

  const [dsLinhVuc, setDsLinhVuc] = useState<LinhVuc[]>([])
  const [dsDonVi, setDsDonVi] = useState<DonVi[]>([])

  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState("")
  const [maTheoDoi, setMaTheoDoi] = useState("")
  const [email, setEmail] = useState("")
  const linhVucOptions = dsLinhVuc.map(lv => ({
    label: lv.TenLinhVuc,
    value: lv.IdLinhVuc.toString()
  }))
  const donViOptions = dsDonVi.map(dv => ({
    label: dv.TenDonVi,
    value: dv.IdDonVi.toString()
  }))


  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const user = JSON.parse(userStr)
      setEmail(user.Email)
    }

    const fetchData = async () => {

      try {

        const meta = await getMeta("linhvuc,donvi")

        setDsLinhVuc(meta.linhvuc)
        setDsDonVi(meta.donvi)

      } catch (error) {

        console.error("Lỗi load dữ liệu:", error)

      } finally {

        setLoading(false)

      }

    }

    fetchData()

  }, [])

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()

    const formData = new FormData()

    formData.append("TieuDe", tieuDe)
    formData.append("NoiDung", noiDung)
    formData.append("IdLinhVuc", linhVuc)
    formData.append("IdDonVi", donVi)
    formData.append("MucDoKhanCap", mucDoKhanCap)
    formData.append("AnDanh", anDanh ? "1" : "0")
    formData.append("email", email)

    files.forEach((file) => {
      formData.append("files[]", file)
    })

    try {

      const res = await guiPhanAnh(formData)
      setMessage(res.message)
      setMaTheoDoi(res.data.MaTheoDoi)
      setShowModal(true)

      setTieuDe("")
      setNoiDung("")
      setLinhVuc("")
      setDonVi("")
      setFiles([])

    } catch (error) {

      console.error(error)
      alert("Gửi thất bại")

    }

  }

  if (loading) {
    return <p className="text-center mt-10">Đang tải dữ liệu...</p>
  }

  return (

    <div className="max-w-2xl mx-auto my-10 p-6 bg-white shadow rounded">

      <h1 className="text-2xl font-bold mb-6">
        Gửi phản ánh kiến nghị
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Tiêu đề"
          value={tieuDe}
          onChange={(e) => setTieuDe(e.target.value)}
          className="w-full border-b border-gray-300 px-1 py-2 focus:outline-none focus:border-blue-500"
          required
        />

        <textarea
          placeholder="Nội dung phản ánh"
          value={noiDung}
          onChange={(e) => setNoiDung(e.target.value)}
          className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
          rows={5}
          required
        />

        {/* Gửi mã theo dõi cho email */}
        <input
          type="email"
          placeholder="Email (để nhận phản hồi)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-b border-gray-300 px-1 py-2 focus:outline-none focus:border-blue-500"
        />

        {/* Lĩnh vực */}

        <SelectSearchDropdown
          options={linhVucOptions}
          value={linhVuc}
          onChange={setLinhVuc}
          placeholder="Chọn lĩnh vực"
        />
        {/* Đơn vị */}

        <SelectSearchDropdown
          options={donViOptions}
          value={donVi}
          onChange={setDonVi}
          placeholder="Chọn đơn vị"
        />

        {/* Mức độ khẩn cấp */}

        <select
          value={mucDoKhanCap}
          onChange={(e) => setMucDoKhanCap(e.target.value)}
          className="w-full border p-2 rounded"
        >

          <option value="THAP">Thấp</option>
          <option value="TRUNG_BINH">Trung bình</option>
          <option value="CAO">Cao</option>
          <option value="KHAN_CAP">Khẩn cấp</option>

        </select>

        {/* Ẩn danh */}

        <ToggleSwitch
          checked={anDanh}
          onChange={setAnDanh}
          label="Gửi phản ánh ẩn danh"
        />

        {/* Upload */}

        <FileDropzone setFiles={setFiles} files={files} />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Gửi phản ánh
        </button>

      </form>
      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message={message}
        maTheoDoi={maTheoDoi}
      />
    </div>

  )

}

export default GuiPhanAnh