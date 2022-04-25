import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { TagsContext } from "../../reducers/TagsReducer"

const ProjectList = () => {
  const [tagsState, tagsDispatch] = useContext(TagsContext)
  const { ownerProjectList, collaborateProjectList, totalProjects } = tagsState

  return (
    <>
      <div className="heading-four">Your Projects</div>
      {ownerProjectList &&
        ownerProjectList.map((projectID) => {
          const ownerProject = totalProjects.find((project) => project.id === projectID)
          return (
            <Link to={`/${ownerProject.id}`} key={ownerProject.id} className="task">
              {ownerProject.title}
            </Link>
          )
        })}
      <div className="heading-four">Projects collaborate with you</div>
      {collaborateProjectList &&
        collaborateProjectList.map((projectID) => {
          const collaborateProject = totalProjects.find(
            (project) => project.id === projectID
          )
          return (
            <Link
              to={`/${collaborateProject.id}`}
              key={collaborateProject.id}
              className="task"
            >
              {collaborateProject.title}
            </Link>
          )
        })}
    </>
  )
}

export default ProjectList
