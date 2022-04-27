import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { css } from "@emotion/react"
import PuffLoader from "react-spinners/ClipLoader"

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`

const ProjectList = () => {
  const { ownerProjects, collaborateProjects, userProjects } = useSelector(
    (state) => state.user
  )
  const { totalProjectList } = useSelector((state) => state.projects)
  const { isLoading } = useSelector((state) => state.status)
  return (
    <>
      {JSON.stringify(totalProjectList) === "{}" ? (
        <PuffLoader loading={isLoading} css={override} size={150} />
      ) : (
        <>
          <div className="heading-four">Your Projects</div>
          {ownerProjects &&
            ownerProjects.map((projectID) => {
              const ownerProject = totalProjectList[projectID]
              return (
                <Link
                  to={`/dashboard/list/${ownerProject.id}`}
                  key={ownerProject.id}
                  className="task"
                >
                  {ownerProject.title}
                </Link>
              )
            })}
          <div className="heading-four">Projects collaborate with you</div>
          {collaborateProjects &&
            collaborateProjects.map((projectID) => {
              const collaborateProject = totalProjectList[projectID]
              !collaborateProject ? (
                <></>
              ) : (
                <Link
                  to={`/dashboard/list/${collaborateProject.id}`}
                  key={collaborateProject.id}
                  className="task"
                >
                  {collaborateProject.title}
                </Link>
              )
            })}
        </>
      )}
    </>
  )
}

export default ProjectList
