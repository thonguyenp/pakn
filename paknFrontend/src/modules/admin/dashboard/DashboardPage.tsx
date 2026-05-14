import { getThongKeMucDoHaiLong, getThongKeTrangThai, getThongKeTreHan } from "@/api/user/homePage/thongKeApi";
import ThongKePieChart from "@/components/shared/ThongKePieChart";
import { useEffect, useState } from "react";
import ThongKeCard from "@/components/admin/ThongKeCard"
import { getThongKeDashboard } from "@/api/admin/thongKeApi";
import ThongKeLineChart from "@/components/admin/ThongKeLineChart"
import { getThongKeNguoiDung6Thang } from "@/api/admin/thongKeApi"

type ThongKeItem = {
  trang_thai: string
  so_luong: number
}


export default function DashboardPage() {
  const [thongKe, setThongKe] = useState<ThongKeItem[]>([]);
  const [thongKeHaiLong, setThongKeHaiLong] = useState<any[]>([]);
  const [thongKeTreHan, setThongKeTreHan] = useState<any[]>([]);
  const [tongQuan, setTongQuan] = useState<any>(null)
  const [nguoiDung6Thang, setNguoiDung6Thang] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tongQuanData = await getThongKeDashboard()
        setTongQuan(tongQuanData)
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

        const nguoidung6Thang =
          await getThongKeNguoiDung6Thang()

        const formattedNguoiDung =
          nguoidung6Thang.theo_thang.map((item: any) => ({
            ...item,
            label: `${item.thang}/${item.nam}`,
          }))

        setNguoiDung6Thang(formattedNguoiDung)
      } catch (err) {
        console.error("Lỗi load homepage:", err)
      }
    }

    fetchData()
  }, [])
  return (

    // Card
    // Chart
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-3">
        <ThongKeCard
          title="Tổng phản ánh"
          value={
            tongQuan?.tong_quan.tong_phan_anh || 0
          }
          color="text-gray-900"
        />

        <ThongKeCard
          title="Chưa xử lý"
          value={
            tongQuan?.tong_quan.chua_xu_ly || 0
          }
          color="text-yellow-600"
        />

        <ThongKeCard
          title="Đang xử lý"
          value={
            tongQuan?.tong_quan.dang_xu_ly || 0
          }
          color="text-blue-600"
        />

        <ThongKeCard
          title="Đã hoàn thành"
          value={
            tongQuan?.tong_quan.da_hoan_thanh || 0
          }
          color="text-green-600"
        />

        <ThongKeCard
          title="Quá hạn"
          value={
            tongQuan?.tong_quan.qua_han || 0
          }
          color="text-red-600"
        />

        <ThongKeCard
          title="Kịp hạn"
          value={
            tongQuan?.tong_quan.kip_han || 0
          }
          color="text-emerald-600"
        />

      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Trạng thái */}
        <div className="w-full">
          <ThongKePieChart
            title="Thống kê trạng thái phản ánh"
            data={thongKe}
            dataKey="so_luong"
            nameKey="trang_thai"
            unit="phản ánh"
          />
        </div>

        {/* Mức độ hài lòng */}
        <div className="w-full">
          <ThongKePieChart
            title="Mức độ hài lòng"
            data={thongKeHaiLong}
            dataKey="so_luong"
            nameKey="muc_do_label"
            unit="đánh giá"
          />
        </div>

        {/* Trễ hạn */}
        <div className="w-full">
          <ThongKePieChart
            title="Thống kê phản ánh trễ hạn"
            data={thongKeTreHan}
            dataKey="so_luong"
            nameKey="trang_thai"
            unit="phản ánh"
          />
        </div>
        <div className="mt-6">
          <ThongKeLineChart
            title="Người dùng đăng ký 6 tháng gần nhất"
            data={nguoiDung6Thang}
            dataKey="tong"
            xKey="label"
          />
        </div>
      </div>
    </div>
  )
}