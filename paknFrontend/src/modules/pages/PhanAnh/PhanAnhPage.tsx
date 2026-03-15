import { useState } from "react"
import PhanAnhCuaToi from "@/components/homepage/PhanAnh/PhanAnhCuaToi"
import PhanAnhDonVi from "@/components/homepage/PhanAnh/PhanAnhDonVi"

export default function PhanAnhPage() {

  const [tab,setTab] = useState<"mine"|"donvi">("mine")

  const permissions: string[] = JSON.parse(localStorage.getItem("permissions") || "[]")
  const viewDonVi = permissions.includes("XemPhanAnhPhong")

  return (

  <div className="max-w-7xl mx-auto mt-10 px-4 mb-4">

    <div className="grid grid-cols-1 md:grid-cols-10 gap-6">

      {/* LEFT */}
      <div className="md:col-span-3 bg-white shadow rounded-lg p-6">

        <div className="flex flex-col gap-3">

          <button
            onClick={()=>setTab("mine")}
            className={`w-full py-2 rounded ${
              tab==="mine"
                ? "bg-[#1e54a4] text-white"
                : "border border-gray-300 hover:bg-gray-100"
            }`}
          >
            Phản ánh của tôi
          </button>

          {viewDonVi && (
            <button
              onClick={()=>setTab("donvi")}
              className={`w-full py-2 rounded ${
                tab==="donvi"
                  ? "bg-[#1e54a4] text-white"
                  : "border border-gray-300 hover:bg-gray-100"
              }`}
            >
              Phản ánh của phòng
            </button>
          )}

        </div>

      </div>

      {/* RIGHT */}
      <div className="md:col-span-7 bg-white shadow rounded-lg p-6 md:p-8">

        {tab === "mine" && <PhanAnhCuaToi />}

        {tab === "donvi" && viewDonVi && <PhanAnhDonVi />}

      </div>

    </div>

  </div>

  )
}