import React from "react"
import Breadcrumb from "../Breadcrumb"
import { Outlet } from "react-router-dom"
import ViewNavigator from "./ViewNavigator"

const ProjectViews = () => {
  return (
    <>
      <div className="menu-container flex-col justify-center md:flex-row md:justify-between">
        <Breadcrumb />
        <ViewNavigator />
      </div>
      <div className="hidden md:block -mt-5 min-h-18 mb-5"></div>
      <Outlet />
    </>
  )
}

export default ProjectViews
