// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-[#003A8F] text-white py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Cột 1 - Bên trái */}
          <div>
            <h3 className="text-xl font-bold mb-4">TRƯỜNG ĐẠI HỌC NHA TRANG</h3>
            <p className="text-sm leading-relaxed mb-4">
              Trải qua 65 năm xây dựng và phát triển, Trường Đại học Nha Trang đã trở thành một trong những cơ sở đào tạo đa ngành, đa lĩnh vực quy mô lớn; là cơ sở nghiên cứu chủ đạo, triển khai ứng dụng công nghệ tiên tiến, đặc biệt trong lĩnh vực thủy sản phục vụ phát triển kinh tế xã hội khu vực Nam Trung Bộ, Tây Nguyên và phạm vi cả nước.
            </p>
            <div className="text-sm">
              <p className="font-semibold mt-4">Thông tin liên hệ</p>
              <p>02 Nguyễn Đình Chiểu, phường Bắc Nha Trang, Khánh Hòa</p>
              <p>Điện thoại: 0258 383 1149 – 0258 383 1147</p>
              <p>Email: dhnt@ntu.edu.vn</p>
              <p>Website: www.ntu.edu.vn</p>
            </div>
          </div>

          {/* Cột 2 */}
          <div>
            <h3 className="text-xl font-bold mb-4">Các trang liên quan</h3>
            <ul className="text-sm space-y-2">
              <li><a href="https://ntu.edu.vn" className="hover:underline">Trường Đại học Nha Trang</a></li>
              <li><a href="https://thuvien.ntu.edu.vn/" className="hover:underline">Thư viện</a></li>
              <li><a href="https://tuyensinh.ntu.edu.vn/" className="hover:underline">Tuyển sinh</a></li>
            </ul>
          </div>

          {/* Cột 3 - Mạng xã hội */}
          <div>
            <h3 className="text-xl font-bold mb-4">Mạng xã hội</h3>
            <div className="flex space-x-6 text-3xl items-start">
              <a href="https://www.facebook.com/NTUedu.Fanpage" className="hover:text-blue-300"><i className="fa-brands fa-facebook"></i></a>
              <a href="https://www.youtube.com/@truongaihocnhatrang8073" className="hover:text-red-400"><i className="fa-brands fa-youtube"></i></a>
              <a href="https://zalo.me/3009201779661000223" className="hover:text-blue-200">
                <img src="./src/images/logo-zalo-vector.png" className="h-10 w-auto" alt="Zalo" />
              </a>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-blue-700 text-center text-sm">
          © {new Date().getFullYear()} Trường Đại học Nha Trang. All rights reserved.
        </div>
      </div>
    </footer>
  );
}