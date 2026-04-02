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
  MdChevronRight,
  MdAutoAwesome
} from 'react-icons/md';

export default function Sidebar({ activePage, onPageChange }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: MdDashboard },
    { id: "addLocals", label: "Add Locals", icon: MdPersonAdd },
    { id: "addRawImli", label: "Add Raw Imli", icon: MdEco },
    { id: "addCleanedImli", label: "Add Cleaned Imli", icon: MdAutoAwesome },
    { id: "assignImli", label: "Assign Imli", icon: MdAssignment },
    { id: "imliReturned", label: "Imli Returned", icon: MdKeyboardReturn },
    { id: "localsProfile", label: "Locals Profile", icon: MdPerson },
    { id: "payment", label: "Payment", icon: MdPayment },
    { id: "billing", label: "Billing", icon: MdReceipt }
  ]

  return (
    <aside className="hidden md:flex w-64 bg-white h-screen flex-col flex-shrink-0 border-r border-gray-200 transition-all duration-300 ease-in-out relative z-30">
      {/* Header */}
      <div className="h-[64px] flex items-center justify-start px-4 gap-3 relative transition-all duration-300">
        <div className="flex items-center justify-center rounded-lg">
          <img
            src="/stms-logo.svg"
            alt="SIT - Super Imli Traders"
            className="h-12 w-auto"
          />
        </div>
        <span className="text-gray-900 font-bold text-sm leading-tight tracking-tight">
          Super Imli Traders
        </span>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activePage === item.id;
          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => onPageChange(item.id)}
                className={`w-full px-4 py-3 justify-start font-medium transition-all duration-200 flex items-center gap-3 relative rounded-lg mb-1 ${isActive
                  ? "text-orange-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-600 rounded-r-full"></div>
                )}
                <IconComponent className={`text-xl flex-shrink-0 ${isActive ? 'text-orange-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                <span className="whitespace-nowrap transition-all duration-300 opacity-100 w-auto">
                  {item.label}
                </span>
              </button>
            </div>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="border-t border-gray-100 p-4 bg-gray-50">
        <div className="relative group">
          <button
            onClick={() => onPageChange("settings")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${activePage === "settings"
              ? "bg-white shadow-sm text-orange-600"
              : "text-gray-600 hover:bg-white hover:shadow-sm"
              }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${activePage === "settings" ? "bg-orange-50" : "bg-gray-200"}`}>
              <MdSettings className={`w-5 h-5 ${activePage === "settings" ? "text-orange-600" : "text-gray-500"}`} />
            </div>
            <p className="font-medium whitespace-nowrap transition-all duration-300 text-sm opacity-100 w-auto ml-2">
              Settings
            </p>
          </button>
        </div>
      </div>
    </aside>
  )
}
