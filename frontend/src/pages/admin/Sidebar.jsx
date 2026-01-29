"use client"

import { 
  MdDashboard, 
  MdPersonAdd, 
  MdEco, 
  MdAssignment, 
  MdKeyboardReturn, 
  MdPerson,
  MdSettings
} from 'react-icons/md';

export default function Sidebar({ activePage, onPageChange, isCollapsed, onToggle }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: MdDashboard },
    { id: "addLocals", label: "Add Locals", icon: MdPersonAdd },
    { id: "addRawImli", label: "Add Raw Imli", icon: MdEco },
    { id: "assignImli", label: "Assign Imli", icon: MdAssignment },
    { id: "imliReturned", label: "Imli Returned", icon: MdKeyboardReturn },
    { id: "localsProfile", label: "Locals Profile", icon: MdPerson },
  ]

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-gradient-to-b  to-gray-100 h-screen flex flex-col flex-shrink-0 shadow-xl transition-all duration-300 ease-in-out`}>
      {/* Header */}
      <div className={`${isCollapsed ? 'px-2' : 'px-6'} py-4 bg-[#ff741f] h-[80px] flex items-center shadow-lg relative overflow-hidden transition-all duration-300`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        {isCollapsed ? (
          <div className="relative z-10 flex items-center justify-center w-full">
            <img 
              src="/stms-logo.svg" 
              alt="SITMS Portal" 
              className="h-10 w-auto filter brightness-0 invert"
            />
          </div>
        ) : (
          <div className="relative z-10 flex items-center gap-3">
            <img 
              src="/stms-logo.svg" 
              alt="SITMS Portal" 
              className="h-10 w-auto filter brightness-0 invert"
            />
          </div>
        )}
      </div>

      {/* Menu Items */}
      <nav className={`flex-1 ${isCollapsed ? 'px-1' : 'px-3'} py-6 space-y-1 transition-all duration-300`}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => onPageChange(item.id)}
                className={`w-full text-left ${isCollapsed ? 'px-0 py-3 justify-center' : 'px-4 py-3.5'} rounded-xl font-medium transition-all duration-200 group flex items-center gap-3 ${
                  activePage === item.id 
                    ? "bg-[#ff741f] text-white shadow-lg shadow-orange-500/25 scale-[1.02]" 
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-700 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3 justify-center w-full">
                  {isCollapsed ? (
                    <IconComponent className="text-xl" />
                  ) : (
                    <>
                      <IconComponent className="text-xl" />
                      <span className="flex-1">{item.label}</span>
                    </>
                  )}
                </div>
              </button>
              {isCollapsed && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Settings */}
      <div className={`border-t border-gray-200/50 ${isCollapsed ? 'p-1' : 'p-3'} bg-gradient-to-r from-gray-50 to-gray-100 transition-all duration-300`}>
        <div className="relative group">
          <button className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3.5'} rounded-xl text-gray-700 font-medium hover:bg-orange-50 hover:text-[#ff741f] transition-all duration-200 group hover:shadow-sm`}>
            {isCollapsed ? (
              <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-200">
                <MdSettings className="w-4 h-4 text-gray-600 group-hover:text-[#ff741f] transition-colors" />
              </div>
            ) : (
              <>
                <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-200">
                  <MdSettings className="w-4 h-4 text-gray-600 group-hover:text-[#ff741f] transition-colors" />
                </div>
                <div>
                  <p className="font-medium">Settings</p>
                </div>
              </>
            )}
          </button>
          {isCollapsed && (
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Settings
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
