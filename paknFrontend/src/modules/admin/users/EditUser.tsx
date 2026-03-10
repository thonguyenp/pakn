import { useEffect, useState } from "react"
import { useParams,useNavigate } from "react-router-dom"
import { userApi } from "@/api/userApi"
import { donViApi } from "@/api/donViApi"

interface DonVi{
  IdDonVi:number
  TenDonVi:string
}

export default function EditUser(){

  const {id} = useParams()
  const navigate = useNavigate()

  const [donVis,setDonVis] = useState<DonVi[]>([])

  const [form,setForm] = useState({
    HoTen:"",
    Email:"",
    SoDienThoai:"",
    MaSo:"",
    IdDonVi:""
  })

  const loadUser = async()=>{

    const res = await userApi.getById(Number(id))

    const u = res.data.user

    setForm({
      HoTen:u.HoTen || "",
      Email:u.Email || "",
      SoDienThoai:u.SoDienThoai || "",
      MaSo:u.MaSo || "",
      IdDonVi:u.IdDonVi || ""
    })
  }

  const loadDonVi = async()=>{

    const res = await donViApi.getList()

    setDonVis(res.data)
  }

  useEffect(()=>{
    loadUser()
    loadDonVi()
  },[])

  const submit = async(e:any)=>{

    e.preventDefault()

    await userApi.update(Number(id),form)

    navigate("admin/nguoidung")
  }

  return(

  <div className="p-6">

    <h1 className="text-xl mb-4">
      Sửa người dùng
    </h1>

    <form
      onSubmit={submit}
      className="space-y-4 max-w-md"
    >

      <input
        value={form.HoTen}
        placeholder="Họ tên"
        className="border p-2 w-full"
        onChange={e=>setForm({...form,HoTen:e.target.value})}
      />

      <input
        value={form.Email}
        placeholder="Email"
        className="border p-2 w-full"
        onChange={e=>setForm({...form,Email:e.target.value})}
      />

      <input
        value={form.MaSo}
        placeholder="Mã số"
        className="border p-2 w-full"
        onChange={e=>setForm({...form,MaSo:e.target.value})}
      />

      <input
        value={form.SoDienThoai}
        placeholder="Số điện thoại"
        className="border p-2 w-full"
        onChange={e=>setForm({...form,SoDienThoai:e.target.value})}
      />

      <select
        value={form.IdDonVi}
        className="border p-2 w-full"
        onChange={e=>setForm({...form,IdDonVi:e.target.value})}
      >

        <option value="">
          -- Chọn đơn vị --
        </option>

        {donVis.map(d=>(
          <option key={d.IdDonVi} value={d.IdDonVi}>
            {d.TenDonVi}
          </option>
        ))}

      </select>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Cập nhật
      </button>

    </form>

  </div>

  )
}