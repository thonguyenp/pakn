import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useVerifyEmail } from "@/hooks/useVerifyEmail";
import VerifyEmailModal from "@/components/shared/VerifyEmailModal";
import ThongKePieChart from "@/components/shared/ThongKePieChart";
import { getHomeData, type HomeResponse } from "@/api/user/homePage/homePageApi";
import { getThongKeTrangThai, getThongKeMucDoHaiLong, getThongKeTreHan } from "@/api/user/homePage/thongKeApi";
import { getPulicSliders, type Slider } from "@/api/admin/sliderApi";

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
    trang_thai: string;
    so_luong: number;
};

function CardItem({ title, items, image, idLinhVuc }: CardItemProps) {
    return (
        <div className="bg-white rounded-xl shadow overflow-hidden flex flex-col">
            <img src={image} className="w-full h-32 object-cover" />
            <div className="bg-blue-600 text-white font-semibold px-4 py-2">{title}</div>
            <div className="p-4 space-y-3 text-sm flex-1">
                {items.map((item, index) => (
                    <Link
                        key={index}
                        to={`/phan-anh/${item.maTheoDoi}/${new Date(item.ngayGui).toISOString().split("T")[0]}`}
                        state={{ ngayGui: item.ngayGui }}
                        className="block border-b pb-2 last:border-none hover:bg-gray-50 hover:pl-1 transition-all"
                    >
                        <p className="line-clamp-2">{item.content}</p>
                        <div className="text-red-700 text-xs mt-1">⏰ {item.date}</div>
                    </Link>
                ))}
            </div>
            {/* ===== XEM THÊM ===== */}
            <div className="px-4 pb-4">
                <Link to={`/tim-kiem?keyword=&id_linh_vuc=${idLinhVuc}`} className="block text-right text-blue-600 text-sm hover:underline">
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
    const [thongKe, setThongKe] = useState<ThongKeItem[]>([]);
    const [thongKeHaiLong, setThongKeHaiLong] = useState<any[]>([]);
    const [thongKeTreHan, setThongKeTreHan] = useState<any[]>([]);
    const [slides, setSlides] = useState<Slider[]>([]);
    const [current, setCurrent] = useState(0);

    // ===== CALL API =====
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [homeDataRes, thongKeData, haiLongData, treHanData, sliderData] = await Promise.all([
                    getHomeData(),
                    getThongKeTrangThai(),
                    getThongKeMucDoHaiLong(),
                    getThongKeTreHan(),
                    getPulicSliders()
                ]);
                setSlides(sliderData.data);

                setHomeData(homeDataRes);
                setThongKe(thongKeData);
                setThongKeHaiLong(
                    haiLongData.map((item: any) => ({
                        ...item,
                        muc_do_label: `${item.muc_do} sao`
                    }))
                );
                setThongKeTreHan(treHanData);
            } catch (err) {
                console.error("Lỗi load homepage:", err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            {token && <VerifyEmailModal token={token} onClose={() => setToken(null)} />}

            {/* ===== SLIDER ===== */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4 md:pt-6">
                <div className="relative overflow-hidden rounded-2xl shadow-lg bg-black">

                    {slides.map((slide, index) => (
                        <div
                            key={slide.IdSlider}
                            className={`transition-opacity duration-500 ${index === current ? "block opacity-100" : "hidden opacity-0"
                                }`}
                        >
                            <div className="relative group">

                                {/* IMAGE */}
                                <img
                                    src={`http://paknproj.test${slide.Anh}`}
                                    alt={slide.TieuDe}
                                    className="w-full max-h-[75vh] object-contain md:object-cover"
                                />

                                {/* OVERLAY */}
                                <div className="absolute inset-0 flex items-end bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300">
                                    <div className="w-full p-4 md:p-8 text-white translate-y-6 group-hover:translate-y-0 transition duration-300">

                                        <h2 className="text-lg sm:text-2xl lg:text-4xl font-bold mb-2">
                                            {slide.TieuDe}
                                        </h2>

                                        <p className="text-xs sm:text-sm lg:text-base text-gray-200 mb-3 lg:mb-5 max-w-2xl line-clamp-2 lg:line-clamp-3">
                                            {slide.MoTa}
                                        </p>

                                        {slide.Link && (
                                            <a
                                                href={slide.Link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm lg:text-base px-3 py-1.5 lg:px-5 lg:py-2 rounded-lg font-medium transition"
                                            >
                                                Xem thêm
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* LEFT */}
                    <button
                        onClick={() =>
                            setCurrent(prev =>
                                prev === 0 ? slides.length - 1 : prev - 1
                            )
                        }
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 hover:bg-black/60 text-white z-20 transition"
                    >
                        ❮
                    </button>

                    {/* RIGHT */}
                    <button
                        onClick={() =>
                            setCurrent(prev => (prev + 1) % slides.length)
                        }
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 hover:bg-black/60 text-white z-20 transition"
                    >
                        ❯
                    </button>

                    {/* DOTS */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrent(index)}
                                className={`w-2.5 h-2.5 rounded-full transition ${current === index ? "bg-white" : "bg-white/50"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
            {/* ===== CONTENT ===== */}
            <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
                {/* ===== PHẢN ÁNH NỔI BẬT ===== */}
                <div className="bg-white rounded-lg shadow p-4 md:p-5">
                    <h2 className="text-lg md:text-xl font-semibold mb-4">Phản ánh nổi bật</h2>
                    {/* 2 cột */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {homeData?.phan_anh_noi_bat.slice(0, 10).map((item) => (
                            <Link
                                key={item.IdPhanAnh}
                                to={`/phan-anh/${item.MaTheoDoi}/${new Date(item.NgayGui).toISOString().split("T")[0]}`}
                                state={{ ngayGui: item.NgayGui }}
                                className="border rounded-md p-3 md:p-4 hover:bg-gray-50 transition"
                            >
                                <h3 className="font-semibold text-sm md:text-base">{item.TieuDe}</h3>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2" dangerouslySetInnerHTML={{ __html: item.NoiDung }}></p>
                                <div className="text-xs text-gray-400 mt-2">Ngày gửi: {item.NgayGuiFormatted || item.NgayGui}</div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ===== PIE CHARTS ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <ThongKePieChart title="Thống kê trạng thái phản ánh" data={thongKe} dataKey="so_luong" nameKey="trang_thai" unit="phản ánh" />
                    <ThongKePieChart title="Mức độ hài lòng" data={thongKeHaiLong} dataKey="so_luong" nameKey="muc_do_label" unit="đánh giá" />
                    <ThongKePieChart title="Thống kê phản ánh trễ hạn" data={thongKeTreHan} dataKey="so_luong" nameKey="trang_thai" unit="phản ánh" />
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