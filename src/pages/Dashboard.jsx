// dashboard.js

import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import { useState } from "react"
import { AiOutlineMenu } from "react-icons/ai"

import Sidebar from "../components/core/Dashboard/Sidebar"

function Dashboard() {
  const { loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
        {/* Hamburger icon for small screens */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-richblack-700">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <AiOutlineMenu size={24} className="text-richblack-100" />
          </button>
          <p className="text-sm text-richblack-200">Dashboard</p>
        </div>

        <div className="mx-auto w-11/12 max-w-[1000px] py-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

