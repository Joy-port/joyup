import React, { useContext, useEffect } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { LogOut } from "react-feather"
import MenuItem from "./Menu/MenuItem"
import TaskList from "./Task/TaskList"
import { user } from "../store/actions/user"
import { useDispatch } from "react-redux"
import { AuthContext } from "./AuthProvider"
import Loader from "./Loader"
const Layout = () => {
  const [userDetail, loading, error] = useContext(AuthContext)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    if (!userDetail) {
      dispatch(user.logout())
      navigate("/signin")
    }
    return
  }, [userDetail])
  const onClick = () => {
    dispatch(user.logout())
  }

  return (
    <>
      {loading ? (
        <Loader isContent={true} />
      ) : (
        <div>
          <div className="body">
            <nav className="menu-list">
              <MenuItem type="layout" />
              <button className="menu-item__light" onClick={onClick}>
                <LogOut />
                <p className="transition-all lg:block md:hidden sm:block">Logout</p>
              </button>
            </nav>
            <TaskList />
            <main className="content">
              <Outlet />
            </main>
          </div>
        </div>
      )}
    </>
  )
}

export default Layout
