import axios from "axios"
import { getToken, clearAuth } from "./auth"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  withCredentials: true,
})

// ─── Request Interceptor: attach token from localStorage ──────────────────────
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor: handle 401 → auto logout ──────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth()
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default api