import { useEffect, useState } from "react"
import { type User } from "../../../types/user"

interface Props {
  initialData?: User
  onSubmit: (data: User) => void
  onCancel: () => void
}

export default function UserForm({
  initialData,
  onSubmit,
  onCancel
}: Props) {

  const [form, setForm] = useState<User>({
    hoTen: "",
    email: "",
    soDienThoai: "",
    maSo: "",
    trangThai: 1,
    idDonVi: undefined
  })

  useEffect(() => {
    if (initialData) setForm(initialData)
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={submit} style={{ marginTop: 20 }}>
      <input
        name="hoTen"
        placeholder="Họ tên"
        value={form.hoTen}
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        name="soDienThoai"
        placeholder="Số điện thoại"
        value={form.soDienThoai}
        onChange={handleChange}
      />

      <input
        name="maSo"
        placeholder="Mã số"
        value={form.maSo}
        onChange={handleChange}
      />

      <br /><br />

      <button type="submit">Lưu</button>
      <button type="button" onClick={onCancel}>
        Hủy
      </button>
    </form>
  )
}