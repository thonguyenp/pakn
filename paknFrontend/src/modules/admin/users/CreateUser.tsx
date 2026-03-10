import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { userApi } from "@/api/userApi"

export default function CreateUser(){

  const navigate = useNavigate()

  const [form,setForm] = useState({
    HoTen:"",
    Email:"",
    MatKhau:"",
    SoDienThoai:"",
    MaSo:""
  })

  const submit = async(e:any)=>{

    e.preventDefault()

    await userApi.create(form)

    navigate("/admin/nguoidung")
  }

  return(

  <div className="p-6">

    <h1 className="text-xl mb-4">
      Tạo người dùng
    </h1>

    <form
      onSubmit={submit}
      className="space-y-4 max-w-md"
    >

      <input
        placeholder="Họ tên"
        className="border p-2 w-full"
        onChange={e=>setForm({...form,HoTen:e.target.value})}
      />

      <input
        placeholder="Email"
        className="border p-2 w-full"
        onChange={e=>setForm({...form,Email:e.target.value})}
      />

      <input
        type="password"
        placeholder="Mật khẩu"
        className="border p-2 w-full"
        onChange={e=>setForm({...form,MatKhau:e.target.value})}
      />

      <input
        placeholder="Mã số"
        className="border p-2 w-full"
        onChange={e=>setForm({...form,MaSo:e.target.value})}
      />

      <input
        placeholder="Số điện thoại"
        className="border p-2 w-full"
        onChange={e=>setForm({...form,SoDienThoai:e.target.value})}
      />

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Tạo
      </button>

    </form>

  </div>

  )
}