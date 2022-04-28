import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { css } from "@emotion/react"
import PuffLoader from "react-spinners/ClipLoader"
import { tags } from "../../sliceReducers/actions/tagsAction"

const override = css`
  display: block;
  margin: 0 auto;
  border-color: slateLight;
`

const ProjectList = () => {
  const { ownerProjects, collaborateProjects } = useSelector((state) => state.user)
  const { totalProjectList } = useSelector((state) => state.projects)
  const dispatch = useDispatch()
  const { isLoading } = useSelector((state) => state.status)
  const onClick = (projectID) => {
    dispatch(tags.switchProject(projectID))
  }
  return (
    <>
      {JSON.stringify(totalProjectList) === "{}" ? (
        <PuffLoader color="slateLight" loading={isLoading} css={override} size={150} />
      ) : (
        <>
          <div className="heading-four">Your Projects</div>
          {ownerProjects &&
            ownerProjects.map((projectID) => {
              if (projectID === "") {
                return
              }
              const ownerProject = totalProjectList[projectID]
              return (
                <Link
                  to={`${ownerProject.id}`}
                  key={ownerProject.id}
                  className="task"
                  onClick={() => onClick(ownerProject.id)}
                >
                  {ownerProject.title}
                </Link>
              )
            })}
          <div className="task cursor-pointer">Create New Project</div>
          <div className="heading-four">Projects collaborate with you</div>
          {collaborateProjects &&
            collaborateProjects.map((projectID) => {
              const collaborateProject = totalProjectList[projectID]
              collaborateProject && (
                <Link
                  to={`${collaborateProject.id}`}
                  key={collaborateProject.id}
                  className="task"
                  onClick={() => onClick(collaborateProject.id)}
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
