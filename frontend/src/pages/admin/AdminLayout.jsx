"use client"

import { useState } from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"
import Dashboard from "./Dashboard"
import AddRawImli from "./AddRawImli"
import AssignImli from "./AssignImli"
import ImliReturned from "./ImliReturned"
import AddLocals from "./AddLocals"
import LocalsProfile from "./LocalsProfile"

const AdminLayout = () => {
  const [activePage, setActivePage] = useState("dashboard")
  const [navigationProps, setNavigationProps] = useState({})
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true) // Start collapsed

  const navigateToAssignImli = (localData) => {
    setNavigationProps({ prefilledLocalId: localData.LocalID, prefilledLocal: localData })
    setActivePage("assignImli")
  }

  const handlePageChange = (pageId) => {
    setNavigationProps({}) // Clear navigation props when changing pages normally
    setActivePage(pageId)
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const pageConfig = {
    dashboard: { component: Dashboard, title: "DASHBOARD GENERAL", props: { navigateToAssignImli, onPageChange: handlePageChange } },
    addLocals : {component : AddLocals, title :"ADD LOCALS", props: {}},
    addRawImli: { component: AddRawImli, title: "ADD RAW IMLI IN STOCKS", props: {} },
    assignImli: { component: AssignImli, title: "ASSIGN IMLI", props: navigationProps },
    imliReturned: { component: ImliReturned, title: "IMLI RETURNED", props: {} },
    localsProfile: { component: LocalsProfile, title: "LOCALS PROFILE", props: { navigateToAssignImli } },
  }

  const currentPage = pageConfig[activePage]
  const CurrentComponent = currentPage.component

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar 
        activePage={activePage} 
        onPageChange={handlePageChange} 
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          title={currentPage.title} 
          onToggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <div className="flex-1 overflow-auto">
          <CurrentComponent {...currentPage.props} />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
