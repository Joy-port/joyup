import { Fragment, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import * as Icon from "react-feather"
import { project } from "../../store/actions/project"
import { tags } from "../../store/actions/tags"
import { checkProjectMessage } from "../../utils/config"
import Loader from "../Loader"

const index = () => {
  const { isFirstTimeUser } = useSelector((state) => state.user)
  const { totalProjectList } = useSelector((state) => state.projects)
  const [isSelectTemplate, setIsSelectTemplate] = useState(null)
  const [selectedTemplateType, setSelectedTemplateType] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [titleAlertMessage, setTitleAlertMessage] = useState(
    checkProjectMessage.createEmptyProject.required
  )
  const [projectTitle, setProjectTitle] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [startCreateProject, setStartCreateProject] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const templateProjects = Object.values(totalProjectList).filter(
    (project) => project.isTemplate === 1
  )
  const closeProjectModalAndSwitchProject = (projectID) => {
    dispatch({ type: "modals/switchCreateProjectModal", payload: false })
    dispatch(tags.switchProject(projectID))
  }
  const runAlertWhenSuccessAndSwitchToPage = (projectID) => {
    setIsLoading(false)
    dispatch({
      type: "alert/status",
      payload: { text: "Project is set up", type: "success" },
    })
    navigate(`${projectID}`)
  }

  const createNewProject = (e) => {
    e.preventDefault()
    if (currentPage === 2) {
      if (projectTitle.trim() === "") {
        dispatch({
          type: "alert/status",
          payload: { text: "please give the project a title", type: "info" },
        })
        return
      }
      setIsLoading(true)
      const projectContent = {
        projectTitle,
        isPublic,
      }
      dispatch(
        project.createNewProject(
          projectContent,
          closeProjectModalAndSwitchProject,
          runAlertWhenSuccessAndSwitchToPage
        )
      )
    } else if (currentPage === 1) {
      setIsLoading(true)
      dispatch(
        project.createNewProjectFromTemplate(
          selectedTemplateType,
          closeProjectModalAndSwitchProject,
          runAlertWhenSuccessAndSwitchToPage
        )
      )
    }
  }

  const checkTitleMessage = (content) => {
    if (content.trim()) {
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
            className={`${isFirstTimeUser ? "invisible" : ""}`}
            onClick={() => {
              setProjectTitle("")
              setIsPublic(false)
              dispatch({ type: "modals/switchCreateProjectModal", payload: false })
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
          <div
            className={`flex justify-center items-center gap-10 grow px-5 md:px-5 py-10 ${
              currentPage !== 2 ? "flex-col md:flex-row" : ""
            }`}
          >
            {isLoading ? (
              <Loader isContent={true} />
            ) : (
              <Fragment>
                {currentPage === 0 ? (
                  <Fragment>
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
                      <Icon.Sidebar size={50} strokeWidth={1.5} />
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
                      <Icon.FolderPlus size={50} strokeWidth={1.5} />
                    </div>
                  </Fragment>
                ) : currentPage === 1 ? (
                  <Fragment>
                    {templateProjects.map((templateDetail) => {
                      const IconName = Icon[templateDetail.icon]
                      return (
                        <div
                          className={`bg-white shadow-light200 shadow-md rounded-lg px-3 py-2 flex flex-col justify-center items-center gap-5 w-48 h-4/6 border-1 cursor-pointer hover:shadow-lg hover:border-blue200  hover:text-blue200 
                      ${
                        selectedTemplateType === templateDetail.id
                          ? "border-blue200 text-blue200"
                          : "border-light100 text-light300"
                      }`}
                          onClick={() => {
                            setSelectedTemplateType(templateDetail.id)
                            setStartCreateProject(true)
                          }}
                          key={templateDetail.id}
                        >
                          <h3 className="heading-four">{templateDetail.title}</h3>
                          <IconName size={50} strokeWidth={1.5} />
                        </div>
                      )
                    })}
                  </Fragment>
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
                          <Icon.AlertTriangle size={16} />
                        ) : (
                          <Icon.CheckCircle size={16} />
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
                          <Icon.Circle color="white" fill="white" />
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </Fragment>
            )}
          </div>
        </div>

        <div className="modal-footer flex justify-between pt-5 pb-5 md:pb-12">
          <div
            className={`w-1/2 md:w-1/3 button-dark flex items-center justify-center gap-3 ${
              currentPage !== 0 ? "opacity-100 cursor-pointer" : "invisible"
            }`}
            onClick={() => {
              setCurrentPage(0)
              setStartCreateProject(false)
            }}
          >
            <Icon.ArrowLeft />
          </div>
          <div className="w-1/2 md:w-1/3">
            <div
              className={`mx-auto max-w-56 hover:bg-blue100 text-white px-3 py-2 rounded flex gap-3  button-dark items-center justify-center ${
                startCreateProject
                  ? "cursor-pointer bg-blue200"
                  : "cursor-default bg-blue100"
              } ${startCreateProject ? "opacity-100 cursor-pointer" : "opacity-50"} ${
                currentPage === 0 ? "invisible" : ""
              }`}
              onClick={(e) => createNewProject(e)}
            >
              <Icon.FolderPlus color="white" />
              <p className="whitespace-nowrap mr-2 text-white">Create Project</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default index
