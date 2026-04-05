export interface SmtpSetting {
  host: string
  port: number
  username: string
  password: string
  encryption?: string
  from_email: string
  from_name: string
}

export interface SmtpResponse {
  message: string
  data: SmtpSetting
}