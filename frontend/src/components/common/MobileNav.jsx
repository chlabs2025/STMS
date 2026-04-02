"use client"

import { useState, useEffect, useRef } from "react"
import {
    MdDashboard,
    MdInventory2,
    MdPeople,
    MdAccountBalanceWallet,
    MdSettings,
    MdEco,
    MdAssignment,
    MdKeyboardReturn,
    MdPersonAdd,
    MdPerson,
    MdReceipt,
    MdPayment,
    MdClose,
    MdAutoAwesome,
} from "react-icons/md"

const NAV_GROUPS = [
    {
        id: "home",
        label: "Home",
        icon: MdDashboard,
        directPage: "dashboard",
    },
    {
        id: "inventory",
        label: "Inventory",
        icon: MdInventory2,
        children: [
            { id: "addRawImli", label: "Add Raw Imli", icon: MdEco },
            { id: "addCleanedImli", label: "Add Cleaned Imli", icon: MdAutoAwesome },
            { id: "assignImli", label: "Assign Imli", icon: MdAssignment },
            { id: "imliReturned", label: "Imli Returned", icon: MdKeyboardReturn },
        ],
    },
    {
        id: "locals",
        label: "Locals",
        icon: MdPeople,
        children: [
            { id: "addLocals", label: "Add Locals", icon: MdPersonAdd },
            { id: "localsProfile", label: "Locals Profile", icon: MdPerson },
        ],
    },
    {
        id: "finance",
        label: "Finance",
        icon: MdAccountBalanceWallet,
        children: [
            { id: "billing", label: "Billing", icon: MdReceipt },
            { id: "payment", label: "Payment", icon: MdPayment },
        ],
    },
    {
        id: "settings",
        label: "Settings",
        icon: MdSettings,
        directPage: "settings",
    },
]

// Find which group a page belongs to
function getActiveGroup(activePage) {
    for (const group of NAV_GROUPS) {
        if (group.directPage === activePage) return group.id
        if (group.children?.some((c) => c.id === activePage)) return group.id
    }
    return "home"
}

export default function MobileNav({ activePage, onPageChange }) {
    const [openSheet, setOpenSheet] = useState(null) // group id or null
    const sheetRef = useRef(null)
    const activeGroup = getActiveGroup(activePage)

    // Close sheet on outside click
    useEffect(() => {
        if (!openSheet) return
        const handler = (e) => {
            if (sheetRef.current && !sheetRef.current.contains(e.target)) {
                setOpenSheet(null)
            }
        }
        document.addEventListener("mousedown", handler)
        document.addEventListener("touchstart", handler)
        return () => {
            document.removeEventListener("mousedown", handler)
            document.removeEventListener("touchstart", handler)
        }
    }, [openSheet])

    const handleTabClick = (group) => {
        if (group.directPage) {
            onPageChange(group.directPage)
            setOpenSheet(null)
        } else {
            setOpenSheet(openSheet === group.id ? null : group.id)
        }
    }

    const handleSubItemClick = (pageId) => {
        onPageChange(pageId)
        setOpenSheet(null)
    }

    const activeSheet = NAV_GROUPS.find((g) => g.id === openSheet)

    return (
        <>
            {/* Backdrop overlay */}
            {openSheet && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity duration-200"
                    onClick={() => setOpenSheet(null)}
                />
            )}

            {/* Slide-up sheet */}
            <div
                ref={sheetRef}
                className={`fixed left-0 right-0 bottom-[64px] z-50 md:hidden transition-all duration-300 ease-out ${openSheet ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
                    }`}
            >
                {activeSheet && activeSheet.children && (
                    <div className="bg-white rounded-t-2xl shadow-2xl border-t border-gray-200 overflow-hidden w-full">
                        {/* Sheet header */}
                        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                            <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                                {activeSheet.label}
                            </span>
                            <button
                                onClick={() => setOpenSheet(null)}
                                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                            >
                                <MdClose className="text-base" />
                            </button>
                        </div>
                        {/* Sub-items */}
                        <div className="py-2">
                            {activeSheet.children.map((child) => {
                                const ChildIcon = child.icon
                                const isActive = activePage === child.id
                                return (
                                    <button
                                        key={child.id}
                                        onClick={() => handleSubItemClick(child.id)}
                                        className={`w-full flex items-center gap-4 px-5 py-3.5 transition-all duration-150 active:scale-[0.98] ${isActive
                                            ? "bg-orange-50 text-orange-600"
                                            : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                                            }`}
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive ? "bg-orange-100" : "bg-gray-100"
                                                }`}
                                        >
                                            <ChildIcon className={`text-xl ${isActive ? "text-orange-600" : "text-gray-500"}`} />
                                        </div>
                                        <span className={`text-sm font-semibold ${isActive ? "text-orange-600" : "text-gray-700"}`}>
                                            {child.label}
                                        </span>
                                        {isActive && (
                                            <div className="ml-auto w-2 h-2 rounded-full bg-orange-500" />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Tab Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/80 backdrop-blur-xl border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-around h-[72px] px-1 pb-[env(safe-area-inset-bottom)]">
                    {NAV_GROUPS.map((group) => {
                        const Icon = group.icon
                        const isActive = activeGroup === group.id
                        const isOpen = openSheet === group.id
                        return (
                            <button
                                key={group.id}
                                onClick={() => handleTabClick(group)}
                                className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-all duration-300 active:scale-90 relative`}
                            >
                                {/* Pill-shaped active background */}
                                {isActive && (
                                    <div className="absolute inset-x-2 inset-y-1 bg-orange-50 rounded-2xl nav-pill-glow transition-all duration-300" />
                                )}
                                <Icon className={`text-[22px] transition-all duration-300 relative z-10 ${isActive ? "text-orange-600" : "text-gray-400"} ${isOpen ? "scale-110" : ""}`} />
                                <span className={`text-[10px] font-bold leading-tight relative z-10 transition-all duration-300 ${isActive ? "text-orange-600" : "text-gray-400"}`}>
                                    {group.label}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </nav>
        </>
    )
}
