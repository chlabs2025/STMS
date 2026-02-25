"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"
import Dashboard from "./Dashboard"
import AddRawImli from "./AddRawImli"
import AssignImli from "./AssignImli"
import ImliReturned from "./ImliReturned"
import AddLocals from "./AddLocals"
import LocalsProfile from "./LocalsProfile"
import Payment from "./Payment"
import Billing from "./Billing"
import Settings from "./Settings"
import MobileNav from "../../components/common/MobileNav"

const AdminLayout = () => {
  const [activePage, setActivePage] = useState("dashboard")
  const [navigationProps, setNavigationProps] = useState({})
  const [isSidebarCollapsed] = useState(false) // Always expanded
  const isPopState = useRef(false)

  // ── Browser history integration ──
  // Replace current entry + add guard entries to prevent escaping to login/landing
  useEffect(() => {
    const currentUrl = window.location.href
    // Tag the current entry as our base
    window.history.replaceState({ page: "dashboard", guard: true }, "", currentUrl)
    // Push a guard entry (same URL so React Router doesn't navigate away)
    window.history.pushState({ page: "dashboard" }, "", currentUrl)
  }, [])

  // Listen for browser back/forward button
  useEffect(() => {
    const handlePopState = (event) => {
      const state = event.state

      // Billing step navigation — let Billing component handle it
      if (state && state.billingStep !== undefined) {
        return
      }

      // Normal page navigation within the app
      if (state && state.page && !state.guard) {
        isPopState.current = true
        setNavigationProps({})
        setActivePage(state.page)
        return
      }

      // Guard entry or unknown state — user trying to leave the app!
      // Force them back to dashboard
      const currentUrl = window.location.pathname === "/admin/dashboard"
        ? window.location.href
        : "/admin/dashboard"

      // Re-add guard entries to rebuild the buffer
      window.history.replaceState({ page: "dashboard", guard: true }, "", currentUrl)
      window.history.pushState({ page: "dashboard" }, "", currentUrl)
      isPopState.current = true
      setActivePage("dashboard")
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const navigateToAssignImli = (localData) => {
    setNavigationProps({ prefilledLocalId: localData.LocalID, prefilledLocal: localData })
    setActivePage("assignImli")
    window.history.pushState({ page: "assignImli" }, "")
  }

  const handlePageChange = useCallback((pageId) => {
    setNavigationProps({}) // Clear navigation props when changing pages normally
    setActivePage(pageId)

    // Only push history if this is NOT a popstate event (user pressing back)
    if (isPopState.current) {
      isPopState.current = false
      return
    }

    // Push a new history entry so browser back button works
    window.history.pushState({ page: pageId }, "")
  }, [])

  const pageConfig = {
    dashboard: { component: Dashboard, title: "DASHBOARD GENERAL", props: { navigateToAssignImli, onPageChange: handlePageChange } },
    addLocals: { component: AddLocals, title: "ADD LOCALS", props: {} },
    addRawImli: { component: AddRawImli, title: "ADD RAW IMLI IN STOCKS", props: {} },
    assignImli: { component: AssignImli, title: "ASSIGN IMLI", props: navigationProps },
    imliReturned: { component: ImliReturned, title: "IMLI RETURNED", props: {} },
    localsProfile: { component: LocalsProfile, title: "LOCALS PROFILE", props: { navigateToAssignImli } },
    payment: { component: Payment, title: "PAYMENT", props: {} },
    billing: { component: Billing, title: "BILLING", props: {} },
    settings: { component: Settings, title: "SETTINGS", props: {} },
  }

  const currentPage = pageConfig[activePage]
  const CurrentComponent = currentPage.component

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden transition-colors duration-300">
      <Sidebar
        activePage={activePage}
        onPageChange={handlePageChange}
        isCollapsed={isSidebarCollapsed}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={currentPage.title}
        />
        <div className="flex-1 overflow-auto pb-16 md:pb-0">
          <CurrentComponent {...currentPage.props} />
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNav activePage={activePage} onPageChange={handlePageChange} />
    </div>
  )
}

export default AdminLayout

