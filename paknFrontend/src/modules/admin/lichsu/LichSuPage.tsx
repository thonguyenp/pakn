import { useEffect, useState } from "react"
import {
    getLichSuXuLy,
    type LichSuXuLyParams,
} from "@/api/admin/lichSuApi"

type LichSuItem = {
    IdLichSuXuLy: number
    HanhDong: string
    GhiChu: string
    Loai: string
    ThoiGian: string

    nguoi_dung?: {
        IdNguoiDung: number
        HoTen: string
        MaSo: string
    }

    phan_anh?: {
        IdPhanAnh: number
        TieuDe: string
    }
}

export default function LichSuPage() {

    // =========================
    // STATE
    // =========================

    const [data, setData] = useState<LichSuItem[]>([])

    const [loading, setLoading] = useState(false)

    const [page, setPage] = useState(1)

    const [lastPage, setLastPage] = useState(1)

    // filter
    const [search, setSearch] = useState("")
    const [loai, setLoai] = useState("")
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")

    // =========================
    // FETCH DATA
    // =========================

    const fetchData = async () => {

        try {

            setLoading(true)

            const params: LichSuXuLyParams = {
                page,
                search: search || undefined,
                Loai: loai || undefined,
                from: from || undefined,
                to: to || undefined,
            }

            const response = await getLichSuXuLy(params)

            setData(response.data)
            setLastPage(response.last_page)

        } catch (error) {

            console.error(error)

        } finally {

            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [page])

    // =========================
    // SEARCH
    // =========================

    const handleSearch = () => {
        setPage(1)
        fetchData()
    }

    // =========================
    // UI
    // =========================

    return (
        <div className="p-6">

            {/* TITLE */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Lịch sử xử lý
                </h1>
            </div>

            {/* FILTER */}
            <div className="bg-white rounded-xl shadow p-4 mb-6">

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

                    {/* SEARCH */}
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-3 py-2"
                    />

                    {/* LOAI */}
                    <select
                        value={loai}
                        onChange={(e) => setLoai(e.target.value)}
                        className="border rounded-lg px-3 py-2"
                    >
                        <option value="">
                            Tất cả loại
                        </option>

                        <option value="AUTH">
                            AUTH
                        </option>

                        <option value="NGUOI_DUNG">
                            NGƯỜI DÙNG
                        </option>

                        <option value="PHAN_ANH">
                            PHẢN ÁNH
                        </option>
                    </select>

                    {/* FROM */}
                    <input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="border rounded-lg px-3 py-2"
                    />

                    {/* TO */}
                    <input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="border rounded-lg px-3 py-2"
                    />

                    {/* BUTTON */}
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
                    >
                        Lọc
                    </button>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="min-w-[1100px] w-full">

                        <thead className="bg-gray-100">

                            <tr className="text-left whitespace-nowrap">

                                <th className="p-3 w-[80px]">
                                    ID
                                </th>

                                <th className="p-3 w-[220px]">
                                    Hành động
                                </th>

                                <th className="p-3 min-w-[350px]">
                                    Ghi chú
                                </th>

                                <th className="p-3 w-[150px]">
                                    Loại
                                </th>

                                <th className="p-3 w-[220px]">
                                    Người thực hiện
                                </th>

                                <th className="p-3 w-[220px]">
                                    Mã số người thực hiện
                                </th>
                                <th className="p-3 w-[220px]">
                                    Thời gian
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>
                                    <td
                                        colSpan={6}
                                        className="text-center p-6"
                                    >
                                        Đang tải...
                                    </td>
                                </tr>

                            ) : data.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan={6}
                                        className="text-center p-6"
                                    >
                                        Không có dữ liệu
                                    </td>
                                </tr>

                            ) : (

                                data.map((item) => (

                                    <tr
                                        key={item.IdLichSuXuLy}
                                        className="border-t hover:bg-gray-50"
                                    >

                                        <td className="p-3">
                                            {item.IdLichSuXuLy}
                                        </td>

                                        <td className="p-3 font-medium">
                                            {item.HanhDong}
                                        </td>

                                        <td className="p-3 max-w-[350px]">

                                            <div className="line-clamp-2 break-words"
                                                dangerouslySetInnerHTML={{ __html: item.GhiChu }}>
                                            </div>

                                        </td>

                                        <td className="p-3">

                                            <span className="px-2 py-1 rounded bg-gray-100 text-sm whitespace-nowrap">
                                                {item.Loai}
                                            </span>

                                        </td>

                                        <td className="p-3 whitespace-nowrap">
                                            {item.nguoi_dung?.HoTen || "N/A"}
                                        </td>
                                        <td className="p-3 whitespace-nowrap">
                                            {item.nguoi_dung?.MaSo || "N/A"}
                                        </td>
                                        <td className="p-3 whitespace-nowrap">
                                            {new Date(
                                                item.ThoiGian
                                            ).toLocaleString("vi-VN")}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* PAGINATION */}
            <div className="flex justify-center gap-2 mt-6">

                <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="border rounded px-4 py-2 disabled:opacity-50"
                >
                    Prev
                </button>

                <span className="px-4 py-2">
                    {page} / {lastPage}
                </span>

                <button
                    disabled={page >= lastPage}
                    onClick={() => setPage(page + 1)}
                    className="border rounded px-4 py-2 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    )
}