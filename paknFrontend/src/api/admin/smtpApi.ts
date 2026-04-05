import { api } from "@/api/api"
import { type SmtpSetting } from "@/types/smtp"

// lấy config
export const getSmtp = async () => {
  const res = await api.get("/admin/smtp")
  return res.data
}

// lưu config
export const saveSmtp = async (data: SmtpSetting) => {
  const res = await api.post("/admin/smtp/save", data)
  return res.data
}

// gửi mail test
export const sendTestMail = async (email: string) => {
  const res = await api.post("/admin/smtp/test", { email })
  return res.data
}