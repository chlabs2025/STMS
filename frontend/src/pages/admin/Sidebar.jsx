"use client"

import {
  MdDashboard,
  MdPersonAdd,
  MdEco,
  MdAssignment,
  MdKeyboardReturn,
  MdPerson,
  MdPayment,
  MdSettings,
  MdReceipt,
  MdChevronLeft,
  MdChevronRight
} from 'react-icons/md';

export default function Sidebar({ activePage, onPageChange, isCollapsed, onToggle }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: MdDashboard },
    { id: "addLocals", label: "Add Locals", icon: MdPersonAdd },
    { id: "addRawImli", label: "Add Raw Imli", icon: MdEco },
    { id: "assignImli", label: "Assign Imli", icon: MdAssignment },
    { id: "imliReturned", label: "Imli Returned", icon: MdKeyboardReturn },
    { id: "localsProfile", label: "Locals Profile", icon: MdPerson },
    { id: "payment", label: "Payment", icon: MdPayment },
    { id: "billing", label: "Billing", icon: MdReceipt }
  ]

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white h-screen flex flex-col flex-shrink-0 border-r border-gray-200 transition-all duration-300 ease-in-out relative z-30`}>
      {/* Header */}
      <div className="bg-[#ff741f] h-[64px] flex items-center justify-between relative transition-all duration-300">

        {/* Logo & Toggle */}
        <div className={`relative z-10 flex items-center h-full ${isCollapsed ? 'w-full justify-center' : 'w-full justify-between px-4'}`}>
          {isCollapsed ? (
            /* When collapsed: Logo with hover-to-toggle behavior */
            <button
              onClick={onToggle}
              className="group flex items-center justify-center transition-all duration-300 cursor-pointer w-10 h-10"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg group-hover:bg-white/20 transition-all duration-300 relative">
                {/* Logo - visible by default, hidden on hover */}
                <img
                  src="/stms-logo.svg"
                  alt="SITMS Portal"
                  className="h-8 w-auto filter brightness-0 invert absolute transition-all duration-300 opacity-100 group-hover:opacity-0 group-hover:scale-75"
                />
                {/* Sidebar Panel Icon - hidden by default, visible on hover */}
                <svg
                  className="w-5 h-5 text-white absolute transition-all duration-300 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                  <line x1="9" y1="3" x2="9" y2="21" strokeWidth="2" />
                </svg>
              </div>
            </button>
          ) : (
            /* When expanded: Just show the logo and toggle button separately */
            <>
              <div className="flex items-center justify-center rounded-lg">
                <img
                  src="/stms-logo.svg"
                  alt="SITMS Portal"
                  className="h-8 w-auto filter brightness-0 invert"
                />
              </div>
              <button
                onClick={onToggle}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-all duration-200 group"
                aria-label="Close sidebar"
              >
                <svg
                  className="w-5 h-5 text-white/80 group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                  <line x1="9" y1="3" x2="9" y2="21" strokeWidth="2" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-3'} py-6 space-y-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]`}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activePage === item.id;
          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => onPageChange(item.id)}
                className={`w-full ${isCollapsed ? 'px-0 py-3 justify-center' : 'px-4 py-3 justify-start'} font-medium transition-all duration-200 flex items-center gap-3 relative rounded-lg mb-1 ${isActive
                  ? "text-orange-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                {isActive && !isCollapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-600 rounded-r-full"></div>
                )}
                <IconComponent className={`text-xl flex-shrink-0 ${isActive ? 'text-orange-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
                  {item.label}
                </span>
              </button>
              {isCollapsed && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-md">
                  {item.label}
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Settings */}
      <div className={`border-t border-gray-100 ${isCollapsed ? 'p-2' : 'p-4'} bg-gray-50`}>
        <div className="relative group">
          <button className={`w-full flex items-center ${isCollapsed ? 'justify-center py-2' : 'gap-3 px-3 py-2'} rounded-lg text-gray-600 font-medium hover:bg-white hover:shadow-sm transition-all duration-200`}>
            <div className={`w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0`}>
              <MdSettings className="w-5 h-5 text-gray-500" />
            </div>
            <p className={`font-medium whitespace-nowrap transition-all duration-300 text-sm ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-2'}`}>
              Settings
            </p>
          </button>

          {isCollapsed && (
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-md">
              Settings
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
