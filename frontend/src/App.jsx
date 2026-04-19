import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeContext"
import { LanguageProvider } from "./context/LanguageContext"

import LandingPage from "./pages/LandingPage"
import Login from "./pages/Login"

import ScrollToTop from "./components/common/ScrollToTop"

// admin
import A_Dashboard from "./pages/admin/AdminLayout"

// operator
import O_Dashboard from "./pages/operator/O_Dashboard"
import O_AddImli from "./pages/operator/O_Addimli"

import PWAUpdatePrompt from "./components/PWAUpdatePrompt"

function App() {
  useEffect(() => {
    const allowedHost = "superimlitraders-tamarind.vercel.app"

    if (
      import.meta.env.MODE === "production" &&
      typeof window !== "undefined" &&
      window.location.host !== allowedHost
    ) {
      const destination = `https://${allowedHost}${window.location.pathname}${window.location.search}`
      window.location.replace(destination)
    }
  }, [])

  return (
    <LanguageProvider>
      <ThemeProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>

            {/* public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />

            {/* admin routes */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/:page" element={<A_Dashboard />} />

            {/* operator routes */}
            <Route path="/operator/dashboard" element={<O_Dashboard />} />

          </Routes>
          <PWAUpdatePrompt />
        </BrowserRouter>
      </ThemeProvider>
    </LanguageProvider>
  )
}

export default App

