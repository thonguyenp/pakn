import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useVerifyEmail } from "@/hooks/useVerifyEmail";
import VerifyEmailModal from "@/components/shared/VerifyEmailModal";
import { getHomeData, type HomeResponse } from "@/api/user/homePageApi";

type CardItemProps = {
    title: string;
    items: {
        content: string;
        date: string;
        maTheoDoi: string;
        ngayGui: string;
    }[];
    image?: string;
};

function CardItem({ title, items, image }: CardItemProps) {
    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">
            <img src={image} className="w-full h-32 object-cover" />

            <div className="bg-blue-600 text-white font-semibold px-4 py-2">
                {title}
            </div>

            <div className="p-4 space-y-3 text-sm">
                {items.map((item, index) => (
                    <Link
                        key={index}
                        to={`/phan-anh/${item.maTheoDoi}/${new Date(item.ngayGui)
                            .toISOString()
                            .split("T")[0]}`}
                        state={{ ngayGui: item.ngayGui }}
                        className="block border-b pb-2 last:border-none hover:bg-gray-50 hover:pl-1 transition-all"                    >
                        <p className="line-clamp-2">{item.content}</p>
                        <div className="text-red-700 text-xs mt-1">
                            ⏰ {item.date}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const navigate = useNavigate();
    const { token, setToken } = useVerifyEmail();

    const [homeData, setHomeData] = useState<HomeResponse | null>(null);
    const [loading, setLoading] = useState(true);

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
                const data = await getHomeData();
                setHomeData(data);
            } catch (err) {
                console.error("Lỗi load homepage:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
            <div className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-10 gap-6">

                {/* ===== LEFT ===== */}
                <div className="lg:col-span-7 bg-white rounded-lg shadow p-4 md:p-5">
                    <h2 className="text-lg md:text-xl font-semibold mb-4">
                        Phản ánh nổi bật
                    </h2>

                    <div className="space-y-4">
                        {homeData?.phan_anh_noi_bat.map((item) => (
                            <div
                                key={item.IdPhanAnh}
                                onClick={() => navigate(`/phan-anh/${item.MaTheoDoi}/${new Date(item.NgayGui).toISOString().split("T")[0]}`, {
                                    state: {
                                        ngayGui: item.NgayGui,
                                    }
                                })}
                                className="border rounded-md p-3 md:p-4 hover:bg-gray-50 cursor-pointer"
                            >
                                <h3 className="font-semibold text-sm md:text-base">
                                    {item.TieuDe}
                                </h3>

                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {item.NoiDung}
                                </p>

                                <div className="text-xs text-gray-400 mt-2">
                                    Ngày gửi: {item.NgayGuiFormatted || item.NgayGui}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ===== RIGHT ===== */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-lg shadow p-4 md:p-5">
                        <h2 className="text-base md:text-lg font-semibold mb-4">
                            Thống kê xử lý
                        </h2>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Đã xử lý</span>
                                <span className="text-green-600 font-semibold">120</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Đang xử lý</span>
                                <span className="text-yellow-600 font-semibold">35</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Chưa xử lý</span>
                                <span className="text-red-600 font-semibold">12</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 md:p-5">
                        <h2 className="text-base md:text-lg font-semibold mb-4">
                            Mức độ hài lòng
                        </h2>

                        <div className="text-center">
                            <div className="text-2xl md:text-3xl font-bold text-blue-600">
                                87%
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Sinh viên hài lòng
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== CARD GRID ===== */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 pb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {homeData?.phan_anh_theo_linh_vuc.map((card, index) => (
                        <CardItem
                            key={index}
                            title={card.linh_vuc.TenLinhVuc}
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