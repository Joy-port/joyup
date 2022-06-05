import { Fragment, useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import * as Icon from "react-feather"
import { user } from "../store/actions/user"
import { AuthContext } from "./AuthProvider"
import TaskList from "./Task/TaskList"
import Loader from "./Loader"
import { pathInfo } from "../utils/config"
import logo from "../assets/images/logo/primary/menu.png"

const Layout = () => {
  const [userDetail, loading, _] = useContext(AuthContext)
  const navigate = useNavigate()
  const { id } = useSelector((state) => state.user)
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const [isShow, setIsShow] = useState(false)
  useEffect(() => {
    if (loading) return
    if (!userDetail) {
      navigate("/signin")
      return
    }
    if (userDetail?.uid || id) {
      dispatch(user.login(userDetail.uid))
      if (!id) {
        dispatch({ type: "user/getUserID", payload: userDetail.uid })
      }
      return
    }
  }, [userDetail, loading])
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
            <nav className="md:hidden flex px-4 py-2 justify-between items-center bg-slateDark">
              <Icon.Menu
                className="cursor-pointer text-light200 hover:bg-slateLight hover:text-white"
                onClick={() => setIsShow(!isShow)}
              />
              <Link to="/">
                <img className="h-10" src={logo} alt="logo" />
              </Link>
              <Icon.Menu className="invisible" />
            </nav>
            <nav
              className={`menu-list ${isShow ? "visible md:flex" : "hidden md:flex"} `}
            >
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
                <Icon.LogOut />
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
