import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { phanAnhApi } from "../../../api/phanAnhApi"
import type { PhanAnh } from "../../../types/phanAnh"

export default function PhanAnhList() {

  const [data,setData] = useState<PhanAnh[]>([])
  const [page,setPage] = useState(1)
  const [lastPage,setLastPage] = useState(1)

  const fetchData = async () => {
    try{
      const res = await phanAnhApi.getAll(page)

      setData(res.data.data)
      setLastPage(res.data.last_page)

    }catch(error){
      console.error(error)
    }
  }

  useEffect(()=>{
    fetchData()
  },[page])

  const handleDelete = async(id:number)=>{

    if(!confirm("Bạn chắc chắn muốn xóa?")) return

    try{
      await phanAnhApi.delete(id)
      fetchData()
    }catch(error){
      console.error(error)
    }
  }

  return (

    <div className="p-6">

      <div className="flex justify-between mb-4">

        <h1 className="text-xl font-bold">
          Quản lý phản ánh
        </h1>

      </div>

      <table className="w-full border">

        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Tiêu đề</th>
            <th className="border p-2">Nội dung</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>

        <tbody>

          {data.map(item=>(
            <tr key={item.IdPhanAnh}>

              <td className="border p-2">
                {item.IdPhanAnh}
              </td>

              <td className="border p-2">
                {item.TieuDe}
              </td>

              <td className="border p-2">
                {item.NoiDung}
              </td>

              <td className="border p-2 flex gap-2">

                <Link
                  to={`/admin/phananh/edit/${item.IdPhanAnh}`}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Sửa
                </Link>

                <button
                  onClick={()=>handleDelete(item.IdPhanAnh)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Xóa
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

      <div className="flex gap-2 mt-4">

        <button
          disabled={page===1}
          onClick={()=>setPage(page-1)}
          className="bg-gray-300 px-3 py-1 rounded"
        >
          Prev
        </button>

        <span>
          Page {page} / {lastPage}
        </span>

        <button
          disabled={page===lastPage}
          onClick={()=>setPage(page+1)}
          className="bg-gray-300 px-3 py-1 rounded"
        >
          Next
        </button>

      </div>

    </div>
  )
}