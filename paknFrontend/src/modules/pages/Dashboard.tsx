import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Phản ánh - Kiến nghị</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Gửi phản ánh mới</h2>
                        <p className="mb-4">Gửi ý kiến, khiếu nại, kiến nghị đến nhà trường.</p>
                        <button
                            onClick={() => navigate('/phan-anh/create')}
                            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
                        >
                            Gửi ngay
                        </button>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Xem phản ánh của bạn</h2>
                        <p className="mb-4">Theo dõi trạng thái các phản ánh đã gửi.</p>
                        <button
                            onClick={() => navigate('/phan-anh')}
                            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
                        >
                            Xem danh sách
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center text-gray-600">
                    <p>Chào mừng bạn đến với hệ thống Phản ánh - Kiến nghị Trường Đại học!</p>
                </div>
            </div>
        </div>
    );
}