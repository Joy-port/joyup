import React, { useContext } from "react"
import { Link, Outlet } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import { viewInfo } from "../helpers/config"
import ProjectList from "../components/View/ProjectList"
import { TagsContext } from "../reducers/TagsReducer"

const Dashboard = () => {
  const [tagState, tagDispatch] = useContext(TagsContext)
  const { selectedProjectID } = tagState
  return (
    <>
      {selectedProjectID !== "" ? (
        <>
          <div className="flex">
            {viewInfo.map((view) => (
              <Link
                key={view.path}
                to={`/dashboard/${view.path}/${selectedProjectID}`}
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
      ) : (
        <ProjectList />
      )}
    </>
  )
}

export default Dashboard
