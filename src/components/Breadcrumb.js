import React from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Folder, File } from "react-feather"

const Breadcrumb = () => {
  const { totalProjectList } = useSelector((state) => state.projects)
  const { projectID } = useParams()
  const location = useLocation()
  return (
    <div className="flex">
      <Link
        to="/projects"
        className="px-4 py-2 flex gap-3 justify-center transition-colors rounded-sm cursor-pointer font-semibold"
      >
        <Folder />
        {totalProjectList &&
        projectID &&
        totalProjectList[projectID] &&
        totalProjectList[projectID].isPublic
          ? "Collaborate Projects"
          : "Projects"}
      </Link>
      {location.pathname.split("/").length > 0 && projectID && (
        <>
          <div className="text-slateLight capitalize px-4 py-2 flex gap-3 justify-center transition-colors rounded-sm cursor-default">
            <div className="-ml-4"> / </div>
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
