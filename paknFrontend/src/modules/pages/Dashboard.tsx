import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVerifyEmail } from "@/hooks/useVerifyEmail";
import VerifyEmailModal from "@/components/shared/VerifyEmailModal";

type CardItemProps = {
    title: string;
    items: { content: string; date: string }[];
    image: string;
};

function CardItem({ title, items, image }: CardItemProps) {
    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">
            {/* Image */}
            <img src={image} className="w-full h-32 object-cover" />

            {/* Title */}
            <div className="bg-blue-600 text-white font-semibold px-4 py-2">
                {title}
            </div>

            {/* Content */}
            <div className="p-4 space-y-3 text-sm">
                {items.map((item, index) => (
                    <div key={index} className="border-b pb-2 last:border-none">
                        <p className="line-clamp-2">{item.content}</p>
                        <div className="text-red-700 text-xs mt-1">
                            ⏰ {item.date}
                        </div>
                    </div>
                ))}

                <div className="text-right text-blue-600 text-sm cursor-pointer hover:underline">
                    Xem thêm
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const navigate = useNavigate();
    const { token, setToken } = useVerifyEmail();

    // Slider data (tạm thời hardcode)
    const slides = [
        {
            id: 1,
            image: "/images/homepage/dashboard/slider1.png",
            title: "Hệ thống phản ánh sinh viên",
            desc: "Tiếp nhận và xử lý nhanh chóng các kiến nghị"
        },
        {
            id: 2,
            image: "/images/homepage/dashboard/slider2.png",
            title: "Minh bạch - Công khai",
            desc: "Theo dõi tiến độ xử lý dễ dàng"
        },
        {
            id: 3,
            image: "/images/homepage/dashboard/slider3.png",
            title: "Cải thiện chất lượng",
            desc: "Lắng nghe ý kiến để phát triển"
        }
    ];
    const cardData = Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        title: "MÔI TRƯỜNG - ĐÔ THỊ",
        image: "/images/homepage/dashboard/slider1.png",
        items: [
            {
                content: "Xả nước thải sinh hoạt ra đường giao thông",
                date: "14/04/2026 20:53"
            },
            {
                content: "Tiếng ồn thi công đêm gây ảnh hưởng",
                date: "14/04/2026 14:04"
            },
            {
                content: "Lấn chiếm vỉa hè",
                date: "13/04/2026 15:32"
            },
            {
                content: "Xả rác bừa bãi",
                date: "13/04/2026 14:39"
            }
        ]
    }));
    const [current, setCurrent] = useState(0);

    // Auto slide
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            {token && (
                <VerifyEmailModal token={token} onClose={() => setToken(null)} />
            )}

            {/* ===== SLIDER ===== */}
            <div className="w-full h-[400px] overflow-hidden relative group">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-all duration-700 ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                            }`}
                    >
                        <img
                            src={slide.image}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}

                {/* ===== NÚT TRÁI ===== */}
                <button
                    onClick={() =>
                        setCurrent((prev) =>
                            prev === 0 ? slides.length - 1 : prev - 1
                        )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 
               bg-black/40 text-white px-3 py-2 rounded-full
               transition duration-300 hover:bg-black/60 z-20 opacity-50 hover:opacity-100"
                >
                    ❮
                </button>

                {/* ===== NÚT PHẢI ===== */}
                <button
                    onClick={() =>
                        setCurrent((prev) =>
                            (prev + 1) % slides.length
                        )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 
               bg-black/40 text-white px-3 py-2 rounded-full
               transition duration-300 hover:bg-black/60 opacity-50 hover:opacity-100 z-20"
                >
                    ❯
                </button>
            </div>
            {/* ===== CONTENT ===== */}
            <div className="max-w-7xl mx-auto p-6 grid grid-cols-10 gap-6">

                {/* ===== LEFT (7) - PHẢN ÁNH ===== */}
                <div className="col-span-7 bg-white rounded-lg shadow p-5">
                    <h2 className="text-xl font-semibold mb-4">
                        Phản ánh nổi bật
                    </h2>

                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer"
                            >
                                <h3 className="font-semibold">
                                    Phản ánh #{item}: Cơ sở vật chất xuống cấp
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Phòng học bị hỏng quạt, cần sửa chữa sớm...
                                </p>
                                <div className="text-xs text-gray-400 mt-2">
                                    Ngày gửi: 20/04/2026
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ===== RIGHT (3) - THỐNG KÊ ===== */}
                <div className="col-span-3 space-y-6">

                    {/* Thống kê xử lý */}
                    <div className="bg-white rounded-lg shadow p-5">
                        <h2 className="text-lg font-semibold mb-4">
                            Thống kê xử lý
                        </h2>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Đã xử lý</span>
                                <span className="font-semibold text-green-600">120</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Đang xử lý</span>
                                <span className="font-semibold text-yellow-600">35</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Chưa xử lý</span>
                                <span className="font-semibold text-red-600">12</span>
                            </div>
                        </div>
                    </div>

                    {/* Mức độ hài lòng */}
                    <div className="bg-white rounded-lg shadow p-5">
                        <h2 className="text-lg font-semibold mb-4">
                            Mức độ hài lòng
                        </h2>

                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">
                                87%
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Sinh viên hài lòng với kết quả xử lý
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== CARD GRID ===== */}
            <div className="max-w-7xl mx-auto px-6 pb-10">
                <div className="grid grid-cols-4 gap-6">
                    {cardData.map((card) => (
                        <CardItem
                            key={card.id}
                            title={card.title}
                            items={card.items}
                            image={card.image}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}