import { useEffect,useState } from "react"
import { useParams,useNavigate } from "react-router-dom"
import { phanAnhApi } from "../../../api/phanAnhApi"
import type { PhanAnh } from "../../../types/phanAnh"

export default function PhanAnhEdit(){

  const {id} = useParams()
  const navigate = useNavigate()

  const [form,setForm] = useState<Partial<PhanAnh>>({})

  const fetchData = async()=>{

    try{

      const res = await phanAnhApi.getById(Number(id))

      setForm(res.data)

    }catch(error){
      console.error(error)
    }

  }

  useEffect(()=>{
    fetchData()
  },[])

  const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async(e:React.FormEvent)=>{

    e.preventDefault()

    try{

      await phanAnhApi.update(Number(id), form as PhanAnh)

      navigate("/admin/phananh")

    }catch(error){
      console.error(error)
    }

  }

  return(

    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">
        Sửa phản ánh
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="TieuDe"
          value={form.TieuDe || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <textarea
          name="NoiDung"
          value={form.NoiDung || ""}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Cập nhật
        </button>

      </form>

    </div>
  )
}