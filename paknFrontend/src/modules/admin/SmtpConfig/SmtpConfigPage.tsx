import { useEffect, useState } from "react"
import { getSmtp, saveSmtp, sendTestMail } from "@/api/admin/smtpApi"
import { type SmtpSetting } from "@/types/smtp"

export default function SmtpConfigPage() {
  const [form, setForm] = useState<SmtpSetting>({
    host: "",
    port: 587,
    username: "",
    password: "",
    encryption: "tls",
    from_email: "",
    from_name: ""
  })

  const [testEmail, setTestEmail] = useState("")
  const [loading, setLoading] = useState(false)

  // load config
  useEffect(() => {
    fetchSmtp()
  }, [])

  const fetchSmtp = async () => {
    try {
      const data = await getSmtp()
      if (data) setForm(data)
    } catch (err) {
      console.log(err)
    }
  }

  // handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  // save
  const handleSave = async () => {
    setLoading(true)
    try {
      await saveSmtp(form)
      alert("Lưu thành công")
    } catch (err) {
      alert("Lỗi khi lưu")
    }
    setLoading(false)
  }

  // test mail
  const handleTest = async () => {
    if (!testEmail) {
      alert("Nhập email test")
      return
    }

    setLoading(true)
    try {
      await sendTestMail(testEmail)
      alert("Gửi mail thành công")
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi gửi mail")
    }
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded-xl">
      <h2 className="text-xl font-bold mb-4">Cấu hình SMTP</h2>

      <div className="grid grid-cols-1 gap-4">

        <input name="host" value={form.host} onChange={handleChange} placeholder="SMTP Host" className="input" />

        <input name="port" value={form.port} onChange={handleChange} placeholder="Port" className="input" />

        <input name="username" value={form.username} onChange={handleChange} placeholder="Username" className="input" />

        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="input" />

        <select name="encryption" value={form.encryption} onChange={handleChange} className="input">
          <option value="tls">TLS</option>
          <option value="ssl">SSL</option>
          <option value="">None</option>
        </select>

        <input name="from_email" value={form.from_email} onChange={handleChange} placeholder="From Email" className="input" />

        <input name="from_name" value={form.from_name} onChange={handleChange} placeholder="From Name" className="input" />

      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
      >
        {loading ? "Đang lưu..." : "Lưu cấu hình"}
      </button>

      <hr className="my-6" />

      <h3 className="font-semibold mb-2">Test gửi mail</h3>

      <input
        value={testEmail}
        onChange={(e) => setTestEmail(e.target.value)}
        placeholder="Nhập email test"
        className="input"
      />

      <button
        onClick={handleTest}
        disabled={loading}
        className="mt-2 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
      >
        {loading ? "Đang gửi..." : "Gửi mail test"}
      </button>
    </div>
  )
}