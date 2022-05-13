import React from "react"
import { viewInfo } from "../../helpers/config"
import { Link, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import * as Icon from "react-feather"

const ViewNavigator = () => {
  const state = useSelector((state) => state.tags)
  const { pathname } = useLocation()

  return (
    <div className="flex gap-3">
      {viewInfo.map((view) => {
        const IconName = Icon[view.icon]
        const isActive = pathname.split("/").includes(view.path)
        const calendarDefaultView = view.name === "Calendar" ? "/month" : ""
        return (
          <Link
            key={view.path}
            to={`/projects/${state.selectedProjectID}/${view.path}${calendarDefaultView}`}
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
  )
}

export default ViewNavigator
