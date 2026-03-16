import axios from "axios"

export const api = axios.create({
  baseURL: "http://paknproj.test/api/",
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
// Xử lý lỗi 401 Unauthorized: khi nhận được lỗi này, sẽ xoá toàn bộ localStorage và redirect về trang login
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