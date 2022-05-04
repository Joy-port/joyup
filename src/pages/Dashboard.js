import React from "react"
import { Link, Outlet } from "react-router-dom"
import { viewInfo } from "../helpers/config"
import { useSelector } from "react-redux"
import * as Icon from "react-feather"

const Dashboard = () => {
  const state = useSelector((state) => state.tags)
  return (
    <>
      <div className="menu-container">
        {viewInfo.map((view) => {
          const IconName = Icon[view.icon]
          return (
            <Link
              key={view.path}
              to={`/dashboard/${state.selectedProjectID}/${view.path}`}
              className="menu-item__dark"
            >
              <IconName />
              <p className="lg:block hidden">{view.name}</p>
            </Link>
          )
        })}
      </div>
      <div className="min-h-18"></div>
      <Outlet />
    </>
  )
}

export default Dashboard
