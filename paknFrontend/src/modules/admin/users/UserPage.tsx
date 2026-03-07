import { useEffect, useState } from "react"
import { userApi } from "../../../api/userApi"
import { type User } from "../../../types/user"
import UserForm from "./UserForm"

export default function UserPage() {

  const [users, setUsers] = useState<User[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showForm, setShowForm] = useState(false)

  const loadUsers = async () => {
    const res = await userApi.getAll()
    setUsers(res.data)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const createUser = async (data: User) => {
    await userApi.create(data)
    setShowForm(false)
    loadUsers()
  }

  const updateUser = async (data: User) => {
    if (!data.idNguoiDung) return
    await userApi.update(data.idNguoiDung, data)
    setEditingUser(null)
    setShowForm(false)
    loadUsers()
  }

  const deleteUser = async (id?: number) => {
    if (!id) return
    if (!confirm("Xóa user?")) return
    await userApi.delete(id)
    loadUsers()
  }

  return (
    <div>
      <h2>Quản lý người dùng</h2>

      <button onClick={() => {
        setEditingUser(null)
        setShowForm(true)
      }}>
        Thêm user
      </button>

      {showForm && (
        <UserForm
          initialData={editingUser || undefined}
          onSubmit={editingUser ? updateUser : createUser}
          onCancel={() => setShowForm(false)}
        />
      )}

      <table border={1} cellPadding={10} style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map(u => (
            <tr key={u.idNguoiDung}>
              <td>{u.idNguoiDung}</td>
              <td>{u.hoTen}</td>
              <td>{u.email}</td>
              <td>
                <button onClick={() => {
                  setEditingUser(u)
                  setShowForm(true)
                }}>
                  Sửa
                </button>

                <button onClick={() => deleteUser(u.idNguoiDung)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}