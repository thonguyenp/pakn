import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { userApi } from "@/api/userApi"
import type { Permission } from "@/types/user"

export default function UserPermissions(){

  const { id } = useParams()

  const [permissions,setPermissions] = useState<Permission[]>([])
  const [userPermissions,setUserPermissions] = useState<number[]>([])
  const [loading,setLoading] = useState(true)

  const load = async()=>{

    try{

      const res = await userApi.getById(Number(id))

      setPermissions(res.data.permissions)
      setUserPermissions(res.data.userPermissions)

    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    if(id){
      load()
    }
  },[id])

  const toggle = (pid:number)=>{

    setUserPermissions(prev => 
      prev.includes(pid)
        ? prev.filter(p=>p!==pid)
        : [...prev,pid]
    )
  }

  const save = async()=>{

    await userApi.updatePermissions(Number(id),userPermissions)

    alert("Cập nhật quyền thành công")
  }

  if(loading){
    return <div className="p-6">Đang tải...</div>
  }

  return(

  <div className="p-6">

    <h1 className="text-xl mb-4">
      Phân quyền người dùng
    </h1>

    <table className="border w-full">

      <thead>
        <tr>
          <th className="border p-2">Quyền</th>
          <th className="border p-2">Cho phép</th>
        </tr>
      </thead>

      <tbody>

        {permissions.map(p=>{

          const checked = userPermissions.includes(p.IdQuyen)

          return(

          <tr key={p.IdQuyen}>

            <td className="border p-2">
              {p.TenQuyen}
            </td>

            <td className="border text-center">

              <input
                type="checkbox"
                checked={checked}
                onChange={()=>toggle(p.IdQuyen)}
              />

            </td>

          </tr>

          )
        })}

      </tbody>

    </table>

    <button
      onClick={save}
      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
    >
      Lưu quyền
    </button>

  </div>

  )
}