import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useVerifyEmail } from "@/hooks/useVerifyEmail";
import VerifyEmailModal from "@/components/shared/VerifyEmailModal";
import { getHomeData, type HomeResponse } from "@/api/user/homePage/homePageApi";
import { getThongKeTrangThai } from "@/api/user/homePage/thongKeApi";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import ThongKePieChart from "@/components/shared/ThongKePieChart"
import { getThongKeMucDoHaiLong } from "@/api/user/homePage/thongKeApi"
import { getThongKeTreHan } from "@/api/user/homePage/thongKeApi"

type CardItemProps = {
    title: string;
    idLinhVuc: number;
    items: {
        content: string;
        date: string;
        maTheoDoi: string;
        ngayGui: string;
    }[];
    image?: string;
};

type ThongKeItem = {
    trang_thai: string
    so_luong: number
}


function CardItem({ title, items, image, idLinhVuc }: CardItemProps) {
    return (
        <div className="bg-white rounded-xl shadow overflow-hidden flex flex-col">
            <img src={image} className="w-full h-32 object-cover" />

            <div className="bg-blue-600 text-white font-semibold px-4 py-2">
                {title}
            </div>

            <div className="p-4 space-y-3 text-sm flex-1">
                {items.map((item, index) => (
                    <Link
                        key={index}
                        to={`/phan-anh/${item.maTheoDoi}/${new Date(item.ngayGui)
                            .toISOString()
                            .split("T")[0]}`}
                        state={{ ngayGui: item.ngayGui }}
                        className="block border-b pb-2 last:border-none hover:bg-gray-50 hover:pl-1 transition-all"
                    >
                        <p className="line-clamp-2">{item.content}</p>
                        <div className="text-red-700 text-xs mt-1">
                            ⏰ {item.date}
                        </div>
                    </Link>
                ))}
            </div>

            {/* ===== XEM THÊM ===== */}
            <div className="px-4 pb-4">
                <Link
                    to={`/tim-kiem?keyword=&id_linh_vuc=${idLinhVuc}`}
                    className="block text-right text-blue-600 text-sm hover:underline"
                >
                    Xem thêm →
                </Link>
            </div>
        </div>
    );
}
export default function DashboardPage() {
    const navigate = useNavigate();
    const { token, setToken } = useVerifyEmail();

    const [homeData, setHomeData] = useState<HomeResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [thongKe, setThongKe] = useState<ThongKeItem[]>([]);
    const [thongKeHaiLong, setThongKeHaiLong] = useState<any[]>([]);
    const [thongKeTreHan, setThongKeTreHan] = useState<any[]>([]);

    // ===== SLIDER =====
    const slides = [
        { id: 1, image: "/images/homepage/dashboard/slider1.png" },
        { id: 2, image: "/images/homepage/dashboard/slider2.png" },
        { id: 3, image: "/images/homepage/dashboard/slider3.png" }
    ];

    const [current, setCurrent] = useState(0);
    // ===== CALL API =====
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getHomeData()
                setHomeData(data)

                const thongKeData = await getThongKeTrangThai()
                setThongKe(thongKeData)

                const haiLongData = await getThongKeMucDoHaiLong()

                // 🔥 thêm label
                const formatted = haiLongData.map((item: any) => ({
                    ...item,
                    muc_do_label: `${item.muc_do} sao`
                }))

                setThongKeHaiLong(formatted)
                const treHanData = await getThongKeTreHan()
                setThongKeTreHan(treHanData)
            } catch (err) {
                console.error("Lỗi load homepage:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])
    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {token && (
                <VerifyEmailModal token={token} onClose={() => setToken(null)} />
            )}

            {/* ===== SLIDER ===== */}
            <div className="w-full h-[200px] sm:h-[300px] md:h-[400px] overflow-hidden relative">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-all duration-500 ${index === current ? "opacity-100 z-10" : "opacity-0"
                            }`}
                    >
                        <img
                            src={slide.image}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}

                {/* LEFT */}
                <button
                    onClick={() =>
                        setCurrent((prev) =>
                            prev === 0 ? slides.length - 1 : prev - 1
                        )
                    }
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 
                    bg-black/40 text-white px-2 md:px-3 py-1 md:py-2 rounded-full z-20"
                >
                    ❮
                </button>

                {/* RIGHT */}
                <button
                    onClick={() =>
                        setCurrent((prev) => (prev + 1) % slides.length)
                    }
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 
                    bg-black/40 text-white px-2 md:px-3 py-1 md:py-2 rounded-full z-20"
                >
                    ❯
                </button>
            </div>

            {/* ===== CONTENT ===== */}
            {/* ===== CONTENT ===== */}
            <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">

                {/* ===== PHẢN ÁNH NỔI BẬT ===== */}
                <div className="bg-white rounded-lg shadow p-4 md:p-5">
                    <h2 className="text-lg md:text-xl font-semibold mb-4">
                        Phản ánh nổi bật
                    </h2>

                    {/* 2 cột */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {homeData?.phan_anh_noi_bat.slice(0, 10).map((item) => (
                            <Link
                                key={item.IdPhanAnh}
                                to={`/phan-anh/${item.MaTheoDoi}/${new Date(item.NgayGui)
                                    .toISOString()
                                    .split("T")[0]}`}
                                state={{ ngayGui: item.NgayGui }}
                                className="border rounded-md p-3 md:p-4 hover:bg-gray-50 transition"
                            >
                                <h3 className="font-semibold text-sm md:text-base">
                                    {item.TieuDe}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2"
                                  dangerouslySetInnerHTML={{ __html: item.NoiDung }}>
                                </p>
                                <div className="text-xs text-gray-400 mt-2">
                                    Ngày gửi:{" "}
                                    {item.NgayGuiFormatted || item.NgayGui}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ===== PIE CHARTS ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                    {/* Trạng thái */}
                    <ThongKePieChart
                        title="Thống kê trạng thái phản ánh"
                        data={thongKe}
                        dataKey="so_luong"
                        nameKey="trang_thai"
                        unit="phản ánh"
                    />

                    {/* Mức độ hài lòng */}
                    <ThongKePieChart
                        title="Mức độ hài lòng"
                        data={thongKeHaiLong}
                        dataKey="so_luong"
                        nameKey="muc_do_label"
                        unit="đánh giá"
                    />

                    {/* Trễ hạn */}
                    <ThongKePieChart
                        title="Thống kê phản ánh trễ hạn"
                        data={thongKeTreHan}
                        dataKey="so_luong"
                        nameKey="trang_thai"
                        unit="phản ánh"
                    />
                </div>
            </div>
            {/* ===== CARD GRID ===== */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 pb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {homeData?.phan_anh_theo_linh_vuc.map((card, index) => (
                        <CardItem
                            key={index}
                            title={card.linh_vuc.TenLinhVuc}
                            idLinhVuc={card.linh_vuc.IdLinhVuc}
                            image={card.linh_vuc.AnhDaiDien}
                            items={card.phan_anhs.map((pa) => ({
                                content: pa.TieuDe,
                                date: pa.NgayGuiFormatted || pa.NgayGui,
                                maTheoDoi: pa.MaTheoDoi ?? "",
                                ngayGui: pa.NgayGui
                            }))}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}