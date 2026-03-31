import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  withCredentials: true, // cookies ke liye IMPORTANT
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("role")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default api