import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { phanAnhApi } from "@/api/admin/phanAnhApi"
import type { PhanAnh } from "../../../types/phanAnh"

export default function PhanAnhForm(){

  const navigate = useNavigate()

  const [form,setForm] = useState<Partial<PhanAnh>>({
    TieuDe:"",
    NoiDung:""
  })

  const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async(e:React.FormEvent) => {

    e.preventDefault()

    try{

      await phanAnhApi.create(form as PhanAnh)

      navigate("/admin/phananh")

    }catch(error){
      console.error(error)
    }

  }

  return (

    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">
        Thêm phản ánh
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="TieuDe"
          placeholder="Tiêu đề"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <textarea
          name="NoiDung"
          placeholder="Nội dung"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Lưu
        </button>

      </form>

    </div>

  )
}