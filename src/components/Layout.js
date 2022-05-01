import React from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { LogOut } from "react-feather"
import MenuItem from "./Menu/MenuItem"
import TaskList from "./Task/TaskList"
import { user } from "../sliceReducers/actions/user"
import { useDispatch } from "react-redux"
const Layout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const onClick = () => {
    dispatch(user.logout())
    navigate(0)
  }
  return (
    <div>
      <div className="body">
        <nav className="menu-list">
          <MenuItem type="layout" />
          <button className="menu-item" onClick={onClick}>
            <LogOut />
            <p className="lg:block md:hidden sm:block">Logout</p>
          </button>
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
