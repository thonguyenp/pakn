import { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { capNhatPhanAnh } from "@/api/user/phanAnh/phanAnhService"
import FileDropzone from "@/components/shared/FileDropzone"

const CapNhatPhanAnhPage = () => {
    const { maTheoDoi } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    const [noiDung, setNoiDung] = useState("")
    const ngayGui = location.state?.ngayGui
    const [files, setFiles] = useState<File[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    useEffect(() => {
        if (!maTheoDoi || !ngayGui) {
            alert("Thiếu thông tin mã theo dõi hoặc ngày gửi")
            navigate("/tra-cuu")
        }
    }, [maTheoDoi, ngayGui, navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!noiDung.trim()) {
            setError("Vui lòng nhập nội dung")
            return
        }

        try {
            setLoading(true)
            setError("")

            await capNhatPhanAnh({
                maTheoDoi: maTheoDoi!,
                ngayGui: ngayGui, // ✅ dùng từ location.state
                NoiDung: noiDung,
                files
            })

            alert("Cập nhật thành công")
            navigate("/tra-cuu")

        } catch (err: any) {
            setError(err.response?.data?.message || "Có lỗi xảy ra")
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-semibold mb-4">
                Bổ sung phản ánh
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Mã theo dõi */}
                <div>
                    <label className="block mb-1 font-medium">Mã theo dõi</label>
                    <input
                        type="text"
                        value={maTheoDoi}
                        disabled
                        className="w-full border rounded-lg p-2 bg-gray-100"
                    />
                </div>

                {/* Nội dung */}
                <div>
                    <label className="block mb-1 font-medium">Nội dung bổ sung</label>
                    <textarea
                        value={noiDung}
                        onChange={(e) => setNoiDung(e.target.value)}
                        className="w-full border rounded-lg p-2 h-32"
                        placeholder="Nhập nội dung bổ sung..."
                    />
                </div>

                {/* Upload file */}
                <FileDropzone files={files} setFiles={setFiles} />

                {/* Error */}
                {error && (
                    <div className="text-red-500 text-sm">
                        {error}
                    </div>
                )}

                {/* Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                    {loading ? "Đang xử lý..." : "Cập nhật"}
                </button>

            </form>
        </div>
    )
}

export default CapNhatPhanAnhPage