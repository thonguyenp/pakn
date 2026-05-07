import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import dayjs from "dayjs"

import { phanAnhApi } from "@/api/admin/phanAnhApi"
import type { PhanAnh } from "@/types/phanAnh"

export default function PhanHoiListPage() {

    const { maTheoDoi } = useParams()

    const [phanAnh, setPhanAnh] = useState<PhanAnh | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {

        const fetchData = async () => {

            try {

                if (!maTheoDoi) return

                const res = await phanAnhApi.getByMaTheoDoi(maTheoDoi)

                setPhanAnh(res.data.data)

            } catch (err) {

                setError("Không tải được phản hồi")

            } finally {

                setLoading(false)

            }
        }

        fetchData()

    }, [maTheoDoi])

    if (loading) {
        return <div className="p-6">Đang tải...</div>
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>
    }

    if (!phanAnh) {
        return <div className="p-6">Không tìm thấy phản ánh</div>
    }

    return (
        <div className="max-w-5xl mx-auto p-6">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">

                <div>
                    <h1 className="text-2xl font-bold">
                        Danh sách phản hồi
                    </h1>

                    <div className="text-gray-500 mt-1">
                        {phanAnh.TieuDe}
                    </div>
                </div>

                <Link
                    to={`/admin/phananh/${phanAnh.MaTheoDoi}`}
                    className="text-blue-600 hover:underline"
                >
                    Quay lại
                </Link>

            </div>

            {/* DANH SÁCH */}
            <div className="space-y-5">

                {phanAnh.phan_hoi?.length > 0 ? (

                    phanAnh.phan_hoi.map((ph) => (

                        <div
                            key={ph.IdPhanHoi}
                            className="bg-white shadow rounded-xl p-5 border"
                        >

                            {/* TOP */}
                            <div className="flex justify-between items-center mb-4">

                                <div>

                                    <div className="font-semibold">
                                        {ph.nguoi_dung?.HoTen}
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        {ph.nguoi_dung?.don_vi?.TenDonVi}
                                    </div>

                                </div>

                                <div className="text-sm text-gray-500">
                                    {dayjs(ph.NgayPhanHoi).format("DD/MM/YYYY HH:mm")}
                                </div>

                            </div>

                            {/* NỘI DUNG */}
                            <div
                                className="whitespace-pre-line text-gray-700"
                                dangerouslySetInnerHTML={{ __html: ph.NoiDung }}
                            >
                            </div>

                            {/* FILE */}
                            {ph.files?.length > 0 && (

                                <div className="mt-5 space-y-2">

                                    <div className="font-medium">
                                        File đính kèm
                                    </div>

                                    {ph.files.map((file) => (

                                        <a
                                            key={file.IdFile}
                                            href={file.url}
                                            target="_blank"
                                            className="flex items-center border rounded-lg p-3 hover:bg-gray-50"
                                        >

                                            <div className="text-xl">
                                                📎
                                            </div>

                                            <div className="ml-3 text-sm truncate">
                                                {file.TenFile}
                                            </div>

                                        </a>

                                    ))}

                                </div>

                            )}

                        </div>

                    ))

                ) : (

                    <div className="bg-white rounded-xl shadow p-6 text-gray-500">
                        Chưa có phản hồi
                    </div>

                )}

            </div>

        </div>
    )
}