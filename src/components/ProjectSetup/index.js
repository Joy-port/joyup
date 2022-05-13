import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { project } from "../../sliceReducers/actions/project"
import { bool, func } from "prop-types"
import { useNavigate } from "react-router-dom"
import { ArrowRight, ArrowLeft } from "react-feather"
import { tags } from "../../sliceReducers/actions/tags"
import { Sidebar, FolderPlus, Circle, AlertTriangle, CheckCircle } from "react-feather"
import { checkProjectMessage } from "../../helpers/config"

const index = ({ setIsOpen }) => {
  const [isSelectTemplate, setIsSelectTemplate] = useState(null)
  const [selectedTemplateType, setSelectedTemplateType] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [titleAlertMessage, setTitleAlertMessage] = useState(
    checkProjectMessage.createEmptyProject.required
  )
  const [projectTitle, setProjectTitle] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [startCreateProject, setStartCreateProject] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const createNewProject = (e) => {
    e.preventDefault()
    if (currentPage === 2) {
      if (projectTitle.trim() === "") {
        alert("please give the project a title")
        return
      }
      const projectContent = {
        projectTitle,
        isPublic,
      }
      dispatch(
        project.createNewProject(projectContent, (projectID) => {
          setIsOpen(false)
          dispatch(tags.switchProject(projectID))
          navigate(`${projectID}`)
        })
      )
      navigate("/projects")
    }
  }
  //   useEffect(() => {
  //     setCurrentPage(0)
  //   }, [])

  const checkTitleMessage = (e) => {
    if (projectTitle.trim()) {
      setTitleAlertMessage(checkProjectMessage.createEmptyProject.required)
      return false
    } else {
      setTitleAlertMessage("")
      return true
    }
  }

  return (
    <div className="modal-bg transition-colors">
      <div className="modal-container bg-white shadow-md modal-md">
        <div className="modal-header flex justify-end items-start">
          <button
            onClick={() => {
              setProjectTitle("")
              setIsPublic(false)
              setIsOpen(false)
            }}
          >
            X
          </button>
        </div>
        <div className="modal-body flex flex-col">
          {currentPage === 0 ? (
            <h2 className="text-light300 heading-two mt-2 text-center mb-5">
              Create Project
            </h2>
          ) : currentPage === 1 ? (
            <h2 className="text-light300 heading-two mt-2 text-center mb-5">
              Select Template
            </h2>
          ) : (
            <h2 className="text-light300 heading-two mt-2 text-center mb-5">
              Create New Project
            </h2>
          )}
          <div className="flex justify-center items-center gap-10 grow">
            {currentPage === 0 ? (
              <>
                <div
                  className={`bg-white shadow-light200 shadow-md rounded-lg px-3 py-2 flex flex-col justify-center items-center gap-5 w-48 h-4/6 border-1  cursor-pointer hover:shadow-lg hover:border-blue200  hover:text-blue200 ${
                    isSelectTemplate === true
                      ? "border-blue200 text-blue200"
                      : "border-light100 text-light300"
                  }`}
                  onClick={() => {
                    setIsSelectTemplate(true)
                    setCurrentPage(1)
                  }}
                >
                  <h3 className="heading-four">Select A Template</h3>
                  <Sidebar size={50} strokeWidth={1.5} />
                </div>
                <div
                  className={`bg-white shadow-light200 shadow-md rounded-lg px-3 py-2 flex flex-col justify-center items-center gap-5 w-48 h-4/6 border-1 border-light100 cursor-pointer hover:shadow-lg hover:border-blue200 text-light300 hover:text-blue200  ${
                    isSelectTemplate === false
                      ? "border-blue200 text-blue200"
                      : "border-light100 text-light300"
                  }`}
                  onClick={() => {
                    setIsSelectTemplate(false)
                    setCurrentPage(2)
                  }}
                >
                  <h3 className="heading-four">Create A Project</h3>
                  <FolderPlus size={50} strokeWidth={1.5} />
                </div>
              </>
            ) : currentPage === 1 ? (
              <>
                <div
                  className={`bg-white shadow-light200 shadow-md rounded-lg px-3 py-2 flex flex-col justify-center items-center gap-5 w-48 h-4/6 border-1  cursor-pointer hover:shadow-lg hover:border-blue200  hover:text-blue200 ${
                    selectedTemplateType === 0
                      ? "border-blue200 text-blue200"
                      : "border-light100 text-light300"
                  }`}
                  onClick={() => {
                    setSelectedTemplateType(0)
                    setStartCreateProject(true)
                  }}
                >
                  <h3 className="heading-four">Select A Template</h3>
                  <Sidebar size={50} strokeWidth={1.5} />
                </div>
                <div
                  className={`bg-white shadow-light200 shadow-md rounded-lg px-3 py-2 flex flex-col justify-center items-center gap-5 w-48 h-4/6 border-1  cursor-pointer hover:shadow-lg hover:border-blue200  hover:text-blue200 ${
                    selectedTemplateType === 1
                      ? "border-blue200 text-blue200"
                      : "border-light100 text-light300"
                  }`}
                  onClick={() => {
                    setSelectedTemplateType(1)
                    setStartCreateProject(true)
                  }}
                >
                  <h3 className="heading-four">Select A Template</h3>
                  <Sidebar size={50} strokeWidth={1.5} />
                </div>
                <div
                  className={`bg-white shadow-light200 shadow-md rounded-lg px-3 py-2 flex flex-col justify-center items-center gap-5 w-48 h-4/6 border-1  cursor-pointer hover:shadow-lg hover:border-blue200  hover:text-blue200 ${
                    selectedTemplateType === 2
                      ? "border-blue200 text-blue200"
                      : "border-light100 text-light300"
                  }`}
                  onClick={() => {
                    setSelectedTemplateType(2)
                    setStartCreateProject(true)
                  }}
                >
                  <h3 className="heading-four">Select A Template</h3>
                  <Sidebar size={50} strokeWidth={1.5} />
                </div>
              </>
            ) : (
              <form
                className="w-2/3 self-start flex flex-col gap-5"
                onSubmit={(e) => createNewProject(e)}
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="title" className="block font-semibold heading-four">
                    Title
                  </label>
                  <input
                    className={`border-0 border-b-2  p-2  ${
                      !projectTitle
                        ? "border-b-danger text-danger placeholder:text-red100"
                        : "border-b-light300 placeholder:text-light100"
                    }`}
                    type="text"
                    id="title"
                    required
                    value={projectTitle}
                    onChange={(e) => {
                      setProjectTitle(e.target.value)
                      checkTitleMessage(e.target.value)
                      setStartCreateProject(true)
                    }}
                    placeholder="Enter project title"
                  />
                  <div
                    className={`text-sm flex gap-2 items-center h-5 ${
                      !projectTitle ? "visible" : "invisible"
                    } ${projectTitle ? "text-success" : "text-danger "}`}
                    style={{ paddingTop: 2, paddingBottom: 2 }}
                  >
                    {projectTitle ? (
                      <AlertTriangle size={16} />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    <div className="text-sm">
                      {titleAlertMessage}
                      <span className="invisible">123</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label htmlFor="public" className="font-semibold mr-5">
                    Public
                  </label>
                  <div
                    className={`rounded-full w-14 px-1 py-1 transition-colors cursor-pointer ${
                      isPublic ? "bg-blue200" : "bg-light100"
                    }`}
                    onClick={() => {
                      setIsPublic(!isPublic)
                    }}
                  >
                    <div
                      className={`transition-all max-w-fit ${
                        isPublic ? "ml-auto" : "mr-auto"
                      }`}
                    >
                      <Circle color="white" fill="white" />
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="modal-footer flex justify-between pb-14">
          <div
            className={`w-1/3 button-dark flex items-center justify-center gap-3 ${
              currentPage !== 0 ? "opacity-100 cursor-pointer" : "invisible"
            }`}
            onClick={(e) => {
              setCurrentPage(0)
              setStartCreateProject(false)
            }}
          >
            <ArrowLeft />
          </div>
          <div
            className={`w-1/3 button-dark items-center flex justify-center gap-3 ${
              startCreateProject ? "opacity-100 cursor-pointer" : "opacity-50"
            }`}
            onClick={() => {
              if (currentPage === 0) {
                isSelectTemplate ? setCurrentPage(1) : setCurrentPage(2)
              }
            }}
          >
            {currentPage !== 0 ? (
              <div
                className={` hover:bg-blue100 text-white px-3 py-2 rounded flex gap-3 ${
                  startCreateProject
                    ? "cursor-pointer bg-blue200"
                    : "cursor-default bg-blue100"
                }`}
                onClick={(e) => createNewProject(e)}
              >
                <FolderPlus />
                <p>create project</p>
              </div>
            ) : (
              <ArrowRight />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

index.propTypes = {
  setIsOpen: func.isRequired,
}

export default index