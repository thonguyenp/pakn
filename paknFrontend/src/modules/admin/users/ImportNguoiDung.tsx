import { useState } from "react"
import { importNguoiDungExcel } from "@/api/admin/userApi"
import FileDropzone from "@/components/shared/FileDropzone"
import { useNavigate } from "react-router-dom"

export default function ImportNguoiDung() {

  const [file, setFile] = useState<File | null>(null)

  const [loading, setLoading] = useState(false)

  const [message, setMessage] = useState("")

  const [error, setError] = useState("")
  const navigate = useNavigate()
  const handleImport = async () => {
    if (!file) {
      setError("Vui lòng chọn file Excel")
      return
    }

    try {

      setLoading(true)
      setError("")
      setMessage("")

      const response = await importNguoiDungExcel(file)

      setMessage(response.message)
      navigate("/admin/nguoidung")
    } catch (err: any) {

      console.error(err)

      setError(
        err?.response?.data?.message ||
        "Import thất bại"
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Import người dùng
      </h1>

      <div className="bg-white shadow rounded-xl p-6 max-w-xl">

        <FileDropzone
          files={file ? [file] : []}
          setFiles={(files) => {
            const selectedFile = files[0]

            if (selectedFile) {
              setFile(selectedFile)
            }
          }}
        />
        

        <button
          onClick={handleImport}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-4"
        >
          {
            loading
              ? "Đang import..."
              : "Import Excel"
          }
        </button>

        {
          message && (
            <div className="mt-4 text-green-600">
              {message}
            </div>
          )
        }

        {
          error && (
            <div className="mt-4 text-red-600">
              {error}
            </div>
          )
        }

      </div>

    </div>
  )
}