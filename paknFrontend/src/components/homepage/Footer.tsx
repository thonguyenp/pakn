// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-[#003A8F] text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>© {new Date().getFullYear()} Đại học Nha Trang. All rights reserved.</p>
        <p className="mt-2 text-sm">Trường Đại học Nha Trang – 02 Nguyễn Đình Chiểu, Nha Trang</p>
      </div>
    </footer>
  );
}