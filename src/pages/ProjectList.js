import React, { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Helmet } from "react-helmet"
import { useNavigate } from "react-router-dom"
import { FolderPlus, Inbox, X, Folder } from "react-feather"
import ProjectSetup from "../components/ProjectSetup"
import { tags } from "../sliceReducers/actions/tags"
import { project } from "../sliceReducers/actions/project"
import { AuthContext } from "../components/AuthProvider"
import { firebase } from "../helpers/firebase"

const ProjectList = () => {
  const [userDetail, loading, error] = useContext(AuthContext)
  const { ownerProjects, collaborateProjects, userProjects, userTasks } = useSelector(
    (state) => state.user
  )
  const { createProjectModalIsOpen } = useSelector((state) => state.modals)
  const { totalProjectList } = useSelector((state) => state.projects)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // const [isOpen, setIsOpen] = useState(false)
  const [isEditTitle, setIsEditTitle] = useState("")
  const [projectTitle, setProjectTile] = useState("")
  const [type, setType] = useState(0)
  const openProject = (projectID) => {
    if (loading || error) return
    dispatch(tags.switchProject(projectID))
    navigate(`${projectID}`)
  }
  const deleteProject = (projectID) => {
    if (loading || error) return
    // if (confirm("confirm to remove the project")) {
    projectID !== "" && dispatch(project.deleteProject(projectID))
    // }
  }
  const editProjectName = async (projectID) => {
    try {
      await firebase.editProjectTitle(projectID, projectTitle)
    } catch (error) {
      dispatch({ type: "status/ERROR", payload: error })
    }
  }

  return (
    <>
      <Helmet>
        <title>JoyUp | Projects </title>
      </Helmet>
      <div className="menu-container">
        <div
          className={`px-4 py-2 flex gap-3 justify-center transition-colors rounded-sm cursor-default font-semibold`}
        >
          <Folder />
          Projects
        </div>
        {userProjects.length > 0 && (
          <div
            className="flex gap-3 items-center justify-center button button-primary cursor-pointer ml-auto"
            onClick={() =>
              dispatch({ type: "modals/switchCreateProjectModal", payload: true })
            }
          >
            <FolderPlus />
            <p>Create Project</p>
          </div>
        )}
      </div>
      <div className="hidden md:block -mt-5 min-h-18"></div>
      {type === 0 ? (
        <>
          {ownerProjects.length === 0 ? (
            <>
              <div
                className="h-full flex flex-col gap-5 justify-center items-center cursor-pointer"
                onClick={() =>
                  dispatch({ type: "modals/switchCreateProjectModal", payload: true })
                }
              >
                <FolderPlus size={40} strokeWidth={1} />
                <p>Create New Project</p>
              </div>
              {createProjectModalIsOpen && <ProjectSetup />}
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
                {ownerProjects.map((projectID) => {
                  if (projectID === "") {
                    return
                  }
                  const ownerProject = totalProjectList[projectID]
                  return (
                    <div
                      key={ownerProject.id}
                      className="border-1 shadow border-light100 bg-white hover:bg-light000 hover:border-light000 rounded cursor-pointer h-28 p-4"
                      onClick={() => {
                        openProject(ownerProject.id)
                      }}
                    >
                      <div className="flex justify-between items-start h-full">
                        <div className="capitalize font-semibold grow hide flex gap-4 items-center z-10">
                          {/* -ml-3 -mr-3 -mt-2 */}
                          {isEditTitle === ownerProject.id ? (
                            <input
                              className="font-semibold bg-transparent rounded z-20 block focus:outline-200 border-1 border-light200 w-32 -m-1 bg-white text-light200"
                              type="text"
                              value={projectTitle}
                              onChange={(e) => {
                                setProjectTile(e.target.value)
                              }}
                              onClick={(e) => {
                                e.stopPropagation()
                              }}
                              onBlur={(e) => {
                                console.log(e, "onBlur")
                                editProjectName(ownerProject.id)
                                setIsEditTitle("")
                                setProjectTile("")
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  editProjectName(ownerProject.id)
                                  setIsEditTitle("")
                                  setProjectTile("")
                                }
                              }}
                            />
                          ) : (
                            <p
                              className="text-overflow-ellipsis h-full overflow-hidden cursor-text"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setIsEditTitle(ownerProject.id)
                                setProjectTile(ownerProject.title)
                              }}
                            >
                              {ownerProject.title}
                            </p>
                          )}
                        </div>
                        <button
                          className={`text-light200 hover:text-light300 ${
                            isEditTitle ? "hidden" : "block"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteProject(ownerProject.id)
                          }}
                        >
                          <X strokeWidth={1} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="collaborate-project">
          <div className="flex justify-end items-center mb-5">
            <div className="flex gap-3 items-center">
              <div
                className="flex gap-3 items-center justify-center button button-light cursor-pointer w-40"
                onClick={() =>
                  dispatch({ type: "modals/switchCreateProjectModal", payload: true })
                }
              >
                <Inbox size={28} />
                <p>Invitation</p>
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
                      openProject(collaborateProject.id)
                    }}
                  >
                    {collaborateProject.title}
                  </div>
                  <button
                    className="block px-4 py-3"
                    onClick={() => deleteProject(collaborateProject.id)}
                  >
                    <X strokeWidth={1} />
                  </button>
                </div>
              )
            })}
        </div>
      )}

      {createProjectModalIsOpen && <ProjectSetup />}
    </>
  )
}

export default ProjectList
