import { useEffect,useState } from "react"
import { api } from "@/api/api"
import { type PhanAnh } from "@/types/phanAnh"

export default function PhanAnhCuaToi(){

  const [data,setData] = useState<PhanAnh[]>([])
  const [loading,setLoading] = useState(true)

  const load = async()=>{

    try{

      const res = await api.get("/phananh/donvi")

      setData(res.data.data)

    }catch(err){
      console.error(err)
    }

    setLoading(false)
  }

  useEffect(()=>{
    load()
  },[])

  if(loading){
    return <div>Loading...</div>
  }

  return(

  <div className="space-y-4">

    {data.map(pa=>(

      <div
        key={pa.IdPhanAnh}
        className="border rounded-lg p-4 hover:shadow"
      >

        <div className="flex justify-between mb-2">

          <h2 className="font-semibold text-lg">
            {pa.TieuDe}
          </h2>

          <span className="text-sm text-gray-500">
            {pa.NgayGui}
          </span>

        </div>

        <p className="text-gray-700">
          {pa.NoiDung}
        </p>

      </div>

    ))}

  </div>

  )
}