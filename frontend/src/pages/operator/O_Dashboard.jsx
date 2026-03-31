import { useNavigate } from 'react-router-dom'
import { MdDarkMode, MdLightMode, MdLogout } from 'react-icons/md'
import { useTheme } from '../../context/ThemeContext'
import toast from 'react-hot-toast'

function O_Dashboard() {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("role")
    toast.success("Logged out successfully")
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Operator Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <span className="text-[#ff741f] text-xl font-bold">»</span>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Operator Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 shadow-sm transition-all duration-300"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 shadow-sm transition-all duration-300"
            aria-label="Logout"
          >
            <MdLogout className="text-xl" />
          </button>
        </div>
      </header>

      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Welcome, Operator</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300">
            This is the protected operator dashboard area. The theme toggle above allows you to switch between light and dark modes.
          </p>
        </div>
      </div>
    </div>
  )
}
export default O_Dashboard
