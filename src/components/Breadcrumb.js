import React from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

const Breadcrumb = () => {
  const { totalProjectList } = useSelector((state) => state.projects)
  const { projectID } = useParams()
  const location = useLocation()
  return (
    <div className="flex text-light200">
      <Link to="/projects">
        {totalProjectList &&
        projectID &&
        totalProjectList[projectID] &&
        totalProjectList[projectID].isPublic
          ? "Collaborate Projects"
          : "Personal Projects"}
      </Link>
      {location.pathname.split("/").length > 0 && projectID && (
        <>
          <div className="px-3"> / </div>
          <div className="text-slateLight capitalize">
            {totalProjectList &&
              totalProjectList[projectID] &&
              totalProjectList[projectID].title}
          </div>
        </>
      )}
    </div>
  )
}

export default Breadcrumb
