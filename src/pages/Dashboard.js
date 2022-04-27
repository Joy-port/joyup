import React from "react"
import { Link, Outlet, useParams } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import { viewInfo } from "../helpers/config"
import { useSelector } from "react-redux"

const Dashboard = () => {
  const state = useSelector((state) => state.tags)
  const { projectID } = useParams
  console.log(projectID)
  return (
    <>
      <div className="flex">
        {viewInfo.map((view) => (
          <Link
            key={view.path}
            to={`/dashboard/${state.selectedProjectID}/${view.path}`}
            className="border rounded-sm px-2 py-1 "
          >
            {view.name}
          </Link>
        ))}
      </div>
      <Outlet />
    </>
  )
}

export default Dashboard
