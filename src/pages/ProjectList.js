import React, { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { FolderPlus, ChevronDown, Inbox, X, Folder, Users, Edit2 } from "react-feather"
import ProjectSetup from "../components/ProjectSetup"
import NewProject from "../components/ProjectSetup/NewProject"
import { tags } from "../sliceReducers/actions/tags"
import { project } from "../sliceReducers/actions/project"
import Loader from "../components/Loader"
import { AuthContext } from "../components/AuthProvider"

const ProjectList = () => {
  const [userDetail, loading, error] = useContext(AuthContext)
  const { ownerProjects, collaborateProjects, userProjects } = useSelector(
    (state) => state.user
  )
  const { totalProjectList } = useSelector((state) => state.projects)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState(0)
  const openProject = (projectID) => {
    if (loading || error) return
    dispatch(tags.switchProject(projectID))
    navigate(`${projectID}`)
  }
  const deleteProject = (projectID) => {
    if (loading || error) return
    if (confirm("confirm to remove the project")) {
      projectID !== "" && dispatch(project.deleteProject(projectID))
    }
  }

  return (
    <>
      <div className="menu-container">
        <div
          className={`menu-item  ${
            type === 0 ? "menu-item__dark--active" : "menu-item__dark"
          }`}
          onClick={() => setType(0)}
        >
          <Folder />
          Personal
        </div>
        {/* <div
          className={`menu-item  ${
            type !== 0 ? "menu-item__dark--active" : "menu-item__dark"
          }`}
          onClick={() => setType(1)}
        >
          <Users />
          Collaborates
        </div> */}
        {userProjects.length > 0 && (
          <div
            className="flex gap-3 items-center justify-center button button-primary cursor-pointer ml-auto"
            onClick={() => setIsOpen(true)}
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
                onClick={() => setIsOpen(true)}
              >
                <FolderPlus size={40} strokeWidth={1} />
                <p>Create New Project</p>
              </div>
              {isOpen && <ProjectSetup setIsOpen={setIsOpen} />}
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
                      className="border-1 shadow border-light100 bg-white   hover:bg-light000 hover:border-light000 rounded cursor-pointer h-28 p-4"
                      onClick={() => {
                        openProject(ownerProject.id)
                      }}
                    >
                      <div className="flex justify-between items-start h-full">
                        <div className="capitalize font-semibold grow hide flex gap-4 items-center">
                          <p className="text-overflow-ellipsis h-full overflow-hidden">
                            {ownerProject.title}
                          </p>
                          {/* <div
                            className=" hover:text-light300 text-light200 show z-20"
                            onClick={(e) => {
                              e.stopPropagation()
                              editProjectName(ownerProject.id)
                            }}
                          >
                            <Edit2 strokeWidth={1} size={16} />
                          </div> */}
                        </div>
                        <button
                          className="block text-light200 hover:text-light300"
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
                onClick={() => setIsOpen(true)}
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

      {isOpen && <ProjectSetup setIsOpen={setIsOpen} />}
    </>
  )
}

export default ProjectList
