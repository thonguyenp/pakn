import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import PhanAnhCuaToi from "@/components/homepage/PhanAnh/PhanAnhCuaToi"
import PhanAnhDonVi from "@/components/homepage/PhanAnh/PhanAnhDonVi"

export default function PhanAnhPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const permissions: string[] = JSON.parse(localStorage.getItem("permissions") || "[]")
  const viewDonVi = permissions.includes("XemPhanAnhPhong")
  const [tab, setTab] = useState<"cuatoi" | "donvi">("cuatoi")

  // LOAD TAB TỪ URL
  useEffect(() => {
    const hash = location.hash.replace("#", "")
    if (hash === "donvi" && viewDonVi) {
      setTab("donvi")
    } else {
      setTab("cuatoi")
    }
  }, [location.hash, viewDonVi])

  // ĐỔI TAB + URL
  const handleChangeTab = (value: "cuatoi" | "donvi") => {
    setTab(value)
    navigate({ hash: value })
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
        {/* LEFT */}
        <div className="md:col-span-3 bg-white shadow rounded-lg p-6">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleChangeTab("cuatoi")}
              className={`w-full py-2 rounded ${tab === "cuatoi" ? "bg-[#1e54a4] text-white" : "border border-gray-300 hover:bg-gray-100"}`}
            >
              Phản ánh của tôi
            </button>

            {viewDonVi && (
              <button
                onClick={() => handleChangeTab("donvi")}
                className={`w-full py-2 rounded ${tab === "donvi" ? "bg-[#1e54a4] text-white" : "border border-gray-300 hover:bg-gray-100"}`}
              >
                Phản ánh của phòng
              </button>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="md:col-span-7 bg-white shadow rounded-lg p-6 md:p-8">
          {tab === "cuatoi" && <PhanAnhCuaToi />}
          {tab === "donvi" && viewDonVi && <PhanAnhDonVi />}
        </div>
      </div>
    </div>
  )
}