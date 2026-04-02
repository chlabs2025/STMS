"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"
import Dashboard from "./Dashboard"
import AddRawImli from "./AddRawImli"
import AddCleanedImli from "./AddCleanedImli"
import AssignImli from "./AssignImli"
import ImliReturned from "./ImliReturned"
import AddLocals from "./AddLocals"
import LocalsProfile from "./LocalsProfile"
import Payment from "./Payment"
import Billing from "./Billing"
import Settings from "./Settings"
import AuditLogs from "./AuditLogs"
import MobileNav from "../../components/common/MobileNav"

const AdminLayout = () => {
  const { page } = useParams()
  const navigate = useNavigate()

  const [navigationProps, setNavigationProps] = useState({})
  const [isSidebarCollapsed] = useState(false) // Always expanded

  const activePage = ["dashboard", "addLocals", "addRawImli", "addCleanedImli", "assignImli", "imliReturned", "localsProfile", "payment", "billing", "settings", "auditLogs"].includes(page) ? page : "dashboard"

  const scrollRef = useRef(null)

  useEffect(() => {
    if (activePage !== "assignImli" && activePage !== "settings") {
      setNavigationProps({})
    }
  }, [activePage])

  // Scroll to top of the inner container whenever the active page changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0)
    }
  }, [activePage])

  const navigateToAssignImli = useCallback((localData) => {
    setNavigationProps({ prefilledLocalId: localData.LocalID, prefilledLocal: localData })
    navigate("/admin/assignImli")
  }, [navigate])

  const handlePageChange = useCallback((pageId, props = {}) => {
    setNavigationProps(props)
    navigate(`/admin/${pageId}`)
  }, [navigate])

  const pageConfig = {
    dashboard: { component: Dashboard, title: "Dashboard", props: { navigateToAssignImli, onPageChange: handlePageChange } },
    addLocals: { component: AddLocals, title: "Add Locals", props: {} },
    addRawImli: { component: AddRawImli, title: "Add Raw Imli", props: {} },
    addCleanedImli: { component: AddCleanedImli, title: "Add Cleaned Imli", props: {} },
    assignImli: { component: AssignImli, title: "Assign Imli", props: navigationProps },
    imliReturned: { component: ImliReturned, title: "Imli Returned", props: {} },
    localsProfile: { component: LocalsProfile, title: "Locals Profile", props: { navigateToAssignImli } },
    payment: { component: Payment, title: "Payment", props: {} },
    billing: { component: Billing, title: "Billing", props: {} },
    settings: { component: Settings, title: "Settings", props: { ...navigationProps, onPageChange: handlePageChange } },
    auditLogs: { component: AuditLogs, title: "System Audit Log", props: { onPageChange: handlePageChange } },
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
          onPageChange={handlePageChange}
        />
        <div ref={scrollRef} className="flex-1 overflow-y-auto pb-20 md:pb-0 no-x-scroll relative">
          <CurrentComponent {...currentPage.props} />
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNav activePage={activePage} onPageChange={handlePageChange} />
    </div>
  )
}

export default AdminLayout
