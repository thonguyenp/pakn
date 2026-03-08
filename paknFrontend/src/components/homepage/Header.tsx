import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="bg-[#E6F0FF] text-[#0C4396] shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo trái */}
                    <div className="flex items-center">
                        <Link to="/" className="flex flex-row">
                            <img src="./src/images/ntu_logo.jpg" alt="" className='h-12 w-auto' />
                            <div className='flex flex-col ml-2'>
                                <span className="text-sm text-[#4B6CB7]">Hệ thống phản ánh kiến nghị</span>
                                <span className="text-2xl font-bold">Trường Đại học Nha Trang</span>
                            </div>
                        </Link>
                    </div>

                    {/* Auth phải */}
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/dang-ky"
                            className="px-4 py-2 text-white hover:bg-[#1D4ED8] rounded-md transition"
                        >
                            Đăng ký
                        </Link>

                        <Link
                            to="/dang-nhap"
                            className="px-5 py-2 bg-white text-[#003A8F] hover:bg-gray-100 rounded-md font-medium transition"
                        >
                            Đăng nhập
                        </Link>
                    </div>

                </div>
            </div>
        </header>
    );
}