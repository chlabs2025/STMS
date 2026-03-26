import { useLang } from "../../context/LanguageContext"

const Header = ({ title }) => {
  const { lang, toggleLang } = useLang()

  return (
    <header className="bg-white px-4 md:px-8 py-3.5 md:py-3 flex items-center justify-between h-[60px] md:h-[64px] border-b border-gray-200 transition-colors duration-300 relative">
      <div className="flex items-center gap-3">
        {/* Mobile: show logo + title since sidebar is hidden */}
        <div className="flex md:hidden items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
            <img
              src="/stms-logo.svg"
              alt="STMS"
              className="h-5 w-auto"
            />
          </div>
          <h2 className="text-sm font-bold tracking-wide truncate text-orange-600">{title}</h2>
        </div>
        {/* Desktop: just the title (sidebar has logo) */}
        <h2 className="hidden md:block text-sm font-bold tracking-wide truncate text-orange-600">{title}</h2>
      </div>

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

      {/* Premium mobile accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500/0 via-orange-500/40 to-orange-500/0 md:hidden" />
    </header>
  )
}

export default Header
