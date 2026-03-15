import { useEffect, useState } from "react"
import { userApi } from "@/api/admin/userApi"
import type { User } from "@/types/user"
import { Link } from "react-router-dom"

export default function UserList() {

  const [users,setUsers] = useState<User[]>([])
  const [page,setPage] = useState(1)
  const [totalPages,setTotalPages] = useState(1)

  const loadUsers = async () => {

    const res = await userApi.getAll(page)

    setUsers(res.data.data)
    setTotalPages(res.data.last_page)
  }

  useEffect(()=>{
    loadUsers()
  },[page])

  const removeUser = async(id:number)=>{

    if(confirm("Xóa người dùng?")){

      await userApi.delete(id)

      loadUsers()
    }
  }

  return (

  <div className="p-6">

    <div className="flex justify-between mb-4">

      <h1 className="text-2xl font-bold">
        Quản lý người dùng
      </h1>

      <Link
        to="/admin/nguoidung/create"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Thêm user
      </Link>

    </div>

    <table className="w-full border">

      <thead className="bg-gray-100">

        <tr>
          <th className="border p-2">ID</th>
          <th className="border p-2">Họ tên</th>
          <th className="border p-2">Email</th>
          <th className="border p-2">Thao tác</th>
        </tr>

      </thead>

      <tbody>

        {users.map(u=>(
        <tr key={u.IdNguoiDung}>

          <td className="border p-2">{u.IdNguoiDung}</td>
          <td className="border p-2">{u.HoTen}</td>
          <td className="border p-2">{u.Email}</td>

          <td className="border p-2 space-x-3">

            <Link
              to={`/admin/nguoidung/edit/${u.IdNguoiDung}`}
              className="text-blue-600"
            >
              Sửa
            </Link>

            <Link
              to={`/admin/nguoidung/permissions/${u.IdNguoiDung}`}
              className="text-green-600"
            >
              Quyền
            </Link>

            <button
              onClick={()=>removeUser(u.IdNguoiDung)}
              className="text-red-600"
            >
              Xóa
            </button>

          </td>

        </tr>
        ))}

      </tbody>

    </table>

    <div className="mt-4 flex gap-2">

      {Array.from({length: totalPages}).map((_,i)=>(
        <button
          key={i}
          onClick={()=>setPage(i+1)}
          className={`px-3 py-1 border ${
            page===i+1 ? "bg-blue-500 text-white":""
          }`}
        >
          {i+1}
        </button>
      ))}

    </div>

  </div>

  )
}