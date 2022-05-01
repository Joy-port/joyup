import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { css } from "@emotion/react"
import PuffLoader from "react-spinners/ClipLoader"
import { tags } from "../../sliceReducers/actions/tags"
import { project } from "../../sliceReducers/actions/project"

const override = css`
  display: block;
  margin: 0 auto;
  border-color: slateLight;
`

const ProjectList = () => {
  const { ownerProjects, collaborateProjects } = useSelector((state) => state.user)
  const { totalProjectList } = useSelector((state) => state.projects)
  const { isLoading } = useSelector((state) => state.status)
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [projectTitle, setProjectTitle] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const onClick = (projectID) => {
    dispatch(tags.switchProject(projectID))
  }

  const createNewProject = (e) => {
    e.preventDefault()
    if (projectTitle.trim() === "") {
      alert("please give the project a title")
      return
    }
    const projectContent = {
      projectTitle,
      isPublic,
    }
    dispatch(
      project.createNewProject(projectContent, () => {
        setIsOpen(false)
      })
    )
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
          <div className="task cursor-pointer" onClick={() => setIsOpen(true)}>
            Create New Project
          </div>
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
          {isOpen && (
            <div className="modal-bg">
              <div className="modal-container">
                <button
                  className="modal-close"
                  onClick={() => {
                    if (confirm("do you want to leave the page without saving?")) {
                      setProjectTitle("")
                      setIsPublic(false)
                      setIsOpen(false)
                    }
                  }}
                >
                  X
                </button>
                <h1 className="text-slateDark heading-two mb-4">Create New Project</h1>
                <form className="flex flex-col" onSubmit={(e) => createNewProject(e)}>
                  <label htmlFor="title">Project Title</label>
                  <input
                    type="text"
                    id="title"
                    required
                    value={projectTitle}
                    onChange={(e) => {
                      if (e.target.value.trim() !== "") {
                        setProjectTitle(e.target.value)
                      }
                    }}
                  />
                  <div className="flex items-center gap-4">
                    <label htmlFor="public" className="mr-5">
                      Public
                    </label>
                    <input
                      className="block"
                      type="checkbox"
                      id="public"
                      checked={isPublic}
                      onChange={() => setIsPublic(!isPublic)}
                    />
                  </div>
                  <button
                    className="button button-dark"
                    onClick={(e) => createNewProject(e)}
                  >
                    Create New Project
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default ProjectList
