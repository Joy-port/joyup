import React from "react"
import { Link, Outlet, useLocation, useParams } from "react-router-dom"
import { viewInfo } from "../helpers/config"
import { useSelector } from "react-redux"
import * as Icon from "react-feather"

const Dashboard = () => {
  const state = useSelector((state) => state.tags)
  const { pathname } = useLocation()
  return (
    <>
      <div className="menu-container">
        {viewInfo.map((view) => {
          const IconName = Icon[view.icon]
          const isActive = pathname.split("/").at(-1) === view.path
          return (
            <Link
              key={view.path}
              to={`/dashboard/${state.selectedProjectID}/${view.path}`}
              className={`menu-item ${
                isActive ? "menu-item__dark--active" : "menu-item__dark"
              }`}
            >
              <IconName />
              <p className="lg:block hidden">{view.name}</p>
            </Link>
          )
        })}
      </div>
      <div className="hidden md:block -mt-5 min-h-18 mb-3"></div>
      <Outlet />
    </>
  )
}

export default Dashboard
