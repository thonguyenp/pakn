import { getThongKeMucDoHaiLong, getThongKeTrangThai, getThongKeTreHan } from "@/api/user/homePage/thongKeApi";
import ThongKePieChart from "@/components/shared/ThongKePieChart";
import { useEffect, useState } from "react";


type ThongKeItem = {
  trang_thai: string
  so_luong: number
}


export default function DashboardPage() {
  const [thongKe, setThongKe] = useState<ThongKeItem[]>([]);
  const [thongKeHaiLong, setThongKeHaiLong] = useState<any[]>([]);
  const [thongKeTreHan, setThongKeTreHan] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {

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
      }
    }

    fetchData()
  }, [])
  return (
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
    </div>
  )
}