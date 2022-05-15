import React from "react"
import Breadcrumb from "../Breadcrumb"
import { Link, Outlet, useLocation, useParams } from "react-router-dom"
import { viewInfo } from "../../helpers/config"
import { useSelector } from "react-redux"
import * as Icon from "react-feather"
import Loader from "../../components/Loader"
import ViewNavigator from "./ViewNavigator"

const ProjectViews = () => {
  const state = useSelector((state) => state.tags)
  const { pathname } = useLocation()
  const { userProjects, userTasks } = useSelector((state) => state.user)
  return (
    <>
      <div className="menu-container flex-col justify-center md:flex-row md:justify-between">
        <Breadcrumb />
        <ViewNavigator />
        {/* {viewInfo.map((view) => {
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
        })} */}
      </div>
      <div className="hidden md:block -mt-5 min-h-18 mb-5"></div>
      <Outlet />
    </>
  )
}

export default ProjectViews
