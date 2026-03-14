import axios from "axios"

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json"
  }
})  //tạo header

//gắn token vào header của tất cả request
api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(

  (response) => response,

  (error) => {

    if (error.response?.status === 401) {

      // xoá toàn bộ localStorage
      localStorage.clear()

      // redirect về login (tránh trường hợp đang ở trang login mà bị lỗi 401)
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  }

)