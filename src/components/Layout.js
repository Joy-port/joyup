import { Fragment, useContext, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { LogOut } from "react-feather"
import { user } from "../store/actions/user"
import { AuthContext } from "./AuthProvider"
import TaskList from "./Task/TaskList"
import Loader from "./Loader"
import { pathInfo } from "../utils/config"
import * as Icon from "react-feather"

const Layout = () => {
  const [userDetail, loading, _] = useContext(AuthContext)
  const navigate = useNavigate()
  const { pathname } = useLocation()
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
    <Fragment>
      {loading ? (
        <Loader isContent={true} />
      ) : (
        <div>
          <div className="body">
            <nav className="menu-list">
              <div>
                {pathInfo.map((item) => {
                  const IconName = Icon[item.icon]
                  let isActive = false
                  if (item.path === "/calendar") {
                    isActive = pathname === "/calendar" || pathname === "/agenda"
                  } else {
                    isActive = pathname.replace("/", "").includes(item.path)
                  }
                  return (
                    <Link key={item.name} to={item.path} id={item.name}>
                      <button
                        className={`menu-item__light ${
                          isActive ? "menu-item__light--active" : ""
                        }`}
                      >
                        <IconName />
                        <p className="lg:block md:hidden sm:block">{item.name}</p>
                      </button>
                    </Link>
                  )
                })}
              </div>
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
    </Fragment>
  )
}

export default Layout
