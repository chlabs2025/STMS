"use client"
import React, { useState, useEffect } from 'react'
import { Eye, EyeClosed } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

function Login() {
  const [username, setusername] = useState("")
  const [password, setpassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const role = localStorage.getItem("role")
    if (isLoggedIn === "true" && role) {
      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true })
      } else if (role === "operator") {
        navigate("/operator/dashboard", { replace: true })
      }
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username || !password) {
      alert("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      const res = await api.post("/login", {
        username,
        password,
      })

      const role = res.data.data.user.role

      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("role", role)

      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true })
      } else if (role === "operator") {
        navigate("/operator/dashboard", { replace: true })
      } else {
        alert("Invalid role")
      }

    } catch (error) {
      alert(
        error.response?.data?.message || "Login failed"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-10">
          <div className="flex flex-col items-center mb-8">
            <img
              src="/stms-logo.svg"
              alt="Super Imli Traders"
              className="h-20 w-auto mb-6 filter brightness-0 opacity-90"
            />
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Login</h1>
            <p className="text-gray-500 mt-2 text-sm font-medium">Welcome back to Super Imli Traders</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone or Email
              </label>
              <input
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                value={username}
                onChange={(e) => setusername(e.target.value)}
                type="text"
                placeholder="Enter your Phone or Email"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium pr-10"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPass ? <Eye size={20} /> : <EyeClosed size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-orange-600 text-white font-bold rounded-lg shadow-sm hover:bg-orange-700 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
