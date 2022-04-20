import React from "react"
import { Outlet } from "react-router-dom"
import MenuItem from "./Menu/MenuItem"
import TaskList from "./Task/TaskList"

const Layout = () => {
  return (
    <div>
      <div className="body">
        <nav className="menu-list">
          <MenuItem type="layout" />
        </nav>
        <TaskList />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
