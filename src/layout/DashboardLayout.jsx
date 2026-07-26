import { useState, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import TopBar from './TopBar.jsx'
import './DashboardLayout.css'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const closeSidebar = useCallback(() => setSidebarOpen(false), [])
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), [])

  return (
    <div className="layout">
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
      <div className="layout__main">
        <TopBar onToggleSidebar={toggleSidebar} />
        <main className="layout__content" onClick={closeSidebar}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
