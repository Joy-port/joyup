import React from "react"
import { Outlet } from "react-router-dom"
import MenuItem from "./MenuItem"
import TaskList from "../Task/TaskList"

const index = () => {
  return (
    <div>
      <div className="body">
        <nav className="menu-list">
          <MenuItem />
        </nav>
        <TaskList />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default index
