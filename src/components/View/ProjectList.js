import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { FolderPlus, ChevronDown, Inbox, Archive } from "react-feather"
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
            className="h-full flex flex-col gap-5 justify-center items-center cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <FolderPlus size={40} strokeWidth={1} />
            <p>Create New Project</p>
          </div>
          {isOpen && <NewProject setIsOpen={setIsOpen} />}
        </>
      ) : (
        <>
          <div className="owner-project mb-3">
            <div className="flex justify-between items-center bg-light000 -mt-3 -mx-4 px-4 py-3 mb-3">
              <div className="heading-four font-medium">Personal Projects</div>
              <div className="flex gap-3 items-center">
                <div
                  className="flex gap-3 items-center justify-center button button-light cursor-pointer w-40"
                  onClick={() => setIsOpen(true)}
                >
                  <FolderPlus size={28} />
                  <p>New Project</p>
                </div>
                <div className="cursor-pointer">
                  <ChevronDown />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full min-h-36">
              {ownerProjects &&
                ownerProjects.map((projectID) => {
                  if (projectID === "") {
                    return
                  }
                  const ownerProject = totalProjectList[projectID]
                  return (
                    <div
                      key={ownerProject.id}
                      className="shadow-md border-1 border-light000 bg-white hover:bg-light200 hover:text-white hover:border-light200 rounded flex justify-between"
                    >
                      <div
                        className="uppercase cursor-pointer px-4 py-3 grow"
                        onClick={() => {
                          onClick(ownerProject.id)
                        }}
                      >
                        {ownerProject.title}
                      </div>
                      <button
                        className="block px-4 py-3"
                        onClick={() => deleteProject(ownerProject.id)}
                      >
                        <Archive strokeWidth={1}></Archive>
                      </button>
                    </div>
                  )
                })}
            </div>
          </div>
          <div className="collaborate-project">
            <div className="flex justify-between items-center bg-light000 -mx-4 px-4 py-3 mb-3">
              <div className="heading-four">Collaborate Projects</div>
              <div className="flex gap-3 items-center">
                <div
                  className="flex gap-3 items-center justify-center button button-light cursor-pointer w-40"
                  onClick={() => setIsOpen(true)}
                >
                  <Inbox size={28} />
                  <p>Invitation</p>
                </div>
                <div className="cursor-pointer">
                  <ChevronDown />
                </div>
              </div>
            </div>
            {collaborateProjects &&
              collaborateProjects.map((projectID) => {
                const collaborateProject = totalProjectList[projectID]
                collaborateProject && (
                  <div
                    key={collaborateProject.id}
                    className="shadow-md border-1 border-light000 bg-white hover:bg-light200 hover:text-white hover:border-light200 rounded flex justify-between"
                  >
                    <div
                      className="uppercase cursor-pointer px-4 py-3 grow"
                      onClick={() => {
                        onClick(collaborateProject.id)
                      }}
                    >
                      {collaborateProject.title}
                    </div>
                    <button
                      className="block px-4 py-3"
                      onClick={() => deleteProject(collaborateProject.id)}
                    >
                      <Archive strokeWidth={1}></Archive>
                    </button>
                  </div>
                )
              })}
          </div>
          {isOpen && <NewProject setIsOpen={setIsOpen} />}
        </>
      )}
    </>
  )
}

export default ProjectList
