import React from "react"
import { Link, Outlet } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import { viewInfo } from "../helpers/config"

const projectID = uuidv4()

const Dashboard = () => {
  return (
    <>
      <div className="flex">
        {viewInfo.map((view) => (
          <Link
            key={view.path}
            to={`/dashboard/${view.path}/${projectID}`}
            className="border rounded-sm px-2 py-1 "
          >
            {view.name}
          </Link>
        ))}
      </div>
      <div>
        <Outlet />
      </div>
    </>
  )
}

export default Dashboard
