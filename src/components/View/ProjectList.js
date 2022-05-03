import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { FolderPlus } from "react-feather"
import NewProject from "../NewProject"
import { tags } from "../../sliceReducers/actions/tags"
import { project } from "../../sliceReducers/actions/project"

const ProjectList = () => {
  const { ownerProjects, collaborateProjects, userProjects } = useSelector(
    (state) => state.user
  )
  const { totalProjectList } = useSelector((state) => state.projects)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const onClick = (projectID) => {
    dispatch(tags.switchProject(projectID))
    navigate(`${projectID}`)
  }
  const deleteProject = (projectID) => {
    if (confirm("confirm to remove the project")) {
      projectID !== "" && dispatch(project.deleteProject(projectID))
    }
  }
  return (
    <>
      {userProjects.length === 0 ? (
        <>
          <div
            className="grow flex flex-col gap-5 justify-center items-center cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <FolderPlus size={40} strokeWidth={1} />
            <p>Create New Project</p>
          </div>
          {isOpen && <NewProject setIsOpen={setIsOpen} />}
        </>
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
                <div key={ownerProject.id} className="task">
                  <div
                    className="grow cursor-pointer"
                    onClick={() => {
                      onClick(ownerProject.id)
                    }}
                  >
                    {ownerProject.title}
                  </div>
                  <button onClick={() => deleteProject(ownerProject.id)}>Delete</button>
                </div>
              )
            })}
          <div className="task cursor-pointer" onClick={() => setIsOpen(true)}>
            Create New Project
          </div>
          <div className="heading-four">Projects collaborate with you</div>
          {collaborateProjects &&
            collaborateProjects.map((projectID) => {
              const collaborateProject = totalProjectList[projectID]
              collaborateProject && (
                <div key={collaborateProject.id} className="task">
                  <div
                    className="grow cursor-pointer"
                    onClick={() => {
                      onClick(collaborateProject.id)
                    }}
                  >
                    {collaborateProject.title}
                  </div>
                  <button onClick={() => deleteProject(collaborateProject.id)}>
                    Delete
                  </button>
                </div>
              )
            })}
          {isOpen && <NewProject setIsOpen={setIsOpen} />}
        </>
      )}
    </>
  )
}

export default ProjectList
