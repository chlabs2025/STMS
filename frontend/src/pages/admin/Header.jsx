const Header = ({ title, onToggleSidebar, isSidebarCollapsed }) => {
  return (
    <header className="bg-[#ff741f] text-white px-6 py-4 flex items-center h-[80px] shadow-lg border-b border-orange-300/30">
      <div className="flex items-center gap-4 w-full">
        <button 
          onClick={onToggleSidebar}
          className="text-white/90 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 active:scale-95 transition-all duration-200"
          aria-label="Toggle sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isSidebarCollapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M5 12h14" />
            )}
          </svg>
        </button>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold tracking-wide truncate text-white/95">{title}</h2>
        </div>
      </div>
    </header>
  )
}

export default Header
