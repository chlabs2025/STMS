import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { MdPerson, MdLogout, MdArrowDropDown, MdArrowBack } from "react-icons/md"
import { useLang } from "../../context/LanguageContext"
import toast from "react-hot-toast"

const Header = ({ title, onPageChange }) => {
  const { lang, toggleLang } = useLang()
  const navigate = useNavigate()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged out successfully")
    navigate("/")
  }

  return (
    <header className="bg-white px-4 md:px-8 py-3.5 md:py-3 flex items-center justify-between h-[60px] md:h-[64px] border-b border-gray-200 transition-colors duration-300 relative">
      <div className="flex items-center gap-3">
        {/* Mobile: show back button or logo + title */}
        <div className="flex md:hidden items-center gap-2.5">
          {title !== "Dashboard" ? (
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-100 active:scale-90 transition-all"
            >
              <MdArrowBack className="text-2xl" />
            </button>
          ) : (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
              <img
                src="/stms-logo.svg"
                alt="STMS"
                className="h-5 w-auto"
              />
            </div>
          )}
          <h2 className={`text-sm font-bold tracking-wide truncate text-gray-900 ${title !== "Dashboard" ? "ml-[-4px]" : ""}`}>{title}</h2>
        </div>
        {/* Desktop: just the title (sidebar has logo) */}
        <h2 className="hidden md:block text-sm font-bold tracking-wide truncate text-orange-600">{title}</h2>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {/* Language Toggle */}
        <button
          onClick={toggleLang}
          className="flex items-center gap-0.5 rounded-full border border-gray-200 bg-gray-50 overflow-hidden text-xs font-semibold shadow-sm hover:shadow transition-all duration-200 shrink-0"
          title={lang === "en" ? "Switch to Urdu" : "Switch to English"}
        >
          <span className={`px-2.5 md:px-3 py-1.5 transition-all duration-200 ${lang === "en" ? "bg-orange-600 text-white" : "text-gray-500"}`}>
            EN
          </span>
          <span className={`px-2.5 md:px-3 py-1.5 transition-all duration-200 ${lang === "ur" ? "bg-orange-600 text-white" : "text-gray-500"}`}>
            اردو
          </span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 hover:bg-gray-50 p-1 md:px-2 md:py-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
              <MdPerson className="text-xl" />
            </div>
            <div className="hidden md:block text-left pr-1">
              <p className="text-sm font-bold text-gray-800 leading-none">Admin</p>
            </div>
            <MdArrowDropDown className="hidden md:block text-gray-400 text-xl" />
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-gray-100 md:hidden">
                <p className="text-sm font-bold text-gray-900">Admin</p>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onPageChange) onPageChange('settings', { activeTab: 'business' });
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors font-medium border-b border-gray-50"
              >
                <MdPerson className="text-lg opacity-80" />
                <span>View Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors font-medium"
              >
                <MdLogout className="text-lg opacity-80" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Premium mobile accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500/0 via-orange-500/40 to-orange-500/0 md:hidden" />
      
      {/* Safe Area Top Spacer for iOS PWA - Matching User Request: "Orange" */}
      <div className="md:hidden absolute top-[-env(safe-area-inset-top)] left-0 right-0 h-[env(safe-area-inset-top)] bg-orange-600" />
    </header>
  )
}

export default Header
