import { useLang } from "../../context/LanguageContext"

const Header = ({ title }) => {
  const { lang, toggleLang } = useLang()

  return (
    <header className="bg-white px-8 py-3 flex items-center justify-between h-[64px] border-b border-gray-200 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <span className="text-orange-600 text-xl font-bold">»</span>
        <h2 className="text-xl font-bold tracking-wide truncate text-orange-600 uppercase text-sm">{title}</h2>
      </div>

      {/* Language Toggle */}
      <button
        onClick={toggleLang}
        className="flex items-center gap-0.5 rounded-full border border-gray-200 bg-gray-50 overflow-hidden text-xs font-semibold shadow-sm hover:shadow transition-all duration-200"
        title={lang === "en" ? "Switch to Urdu" : "Switch to English"}
      >
        <span className={`px-3 py-1.5 transition-all duration-200 ${lang === "en" ? "bg-orange-600 text-white" : "text-gray-500"}`}>
          EN
        </span>
        <span className={`px-3 py-1.5 transition-all duration-200 ${lang === "ur" ? "bg-orange-600 text-white" : "text-gray-500"}`}>
          اردو
        </span>
      </button>
    </header>
  )
}

export default Header
