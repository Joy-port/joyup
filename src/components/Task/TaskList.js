import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { Plus, Clock, PlayCircle } from "react-feather"
import { v4 as uuidv4 } from "uuid"
import useOpenTaskPage from "../../hooks/useOpenTaskPage"

const TaskList = () => {
  const dispatch = useDispatch()
  const { totalTaskList, totalProjectList } = useSelector((state) => state.projects)
  const { userTasks, userProjects } = useSelector((state) => state.user)
  let navigate = useNavigate()
  let { pathname } = useLocation()
  const [openSelector, setOpenSelector] = useState(false)
  const openTaskPage = useOpenTaskPage()
  const createNewTask = () => {
    if (userProjects.length < 1) {
      dispatch({
        type: "alert/status",
        payload: {
          text: "please create a new project before add a new task",
          type: "info",
        },
      })
      if (!pathname.includes("projects")) {
        navigate("/projects")
      }
      return
    }
    const newTaskID = uuidv4()
    dispatch({ type: "task/createNewTask", payload: newTaskID })
    navigate(`/tasks/${newTaskID}`)
  }

  const filterTaskList = userTasks
    .filter((taskID) => {
      const taskDetail = totalTaskList[taskID]
      const taskDueDate = new Date(taskDetail.dueDate).getDate()
      return taskDueDate >= new Date().getDate()
    })
    .sort((a, b) => {
      return totalTaskList[a].dueDate - totalTaskList[b].dueDate
    })
  return (
    <div className="absolute bottom-5 right-5 z-100 bg-transparent flex gap-2">
      {filterTaskList.length > 0 && (
        <div
          className="rounded button-outline-light min-w-32 max-w-72"
          id="openClockButton"
        >
          <div
            className="relative w-56 py-2 px-3 rounded capitalize whitespace-nowrap"
            onClick={() => {
              if (userTasks.length < 1) {
                dispatch({
                  type: "alert/status",
                  payload: {
                    text: "there is no task, choose or create a project to start a new file for tasks",
                    type: "danger",
                  },
                })
                navigate("/projects")
                return
              }
              setOpenSelector(!openSelector)
            }}
            onBlur={() => {
              setOpenSelector(false)
            }}
          >
            <p className="flex gap-2 items-center rounded -my-2 -mx-3 py-2 px-3 bg-slateLight text-white cursor-pointer">
              <Clock />
              Select Task to Start
            </p>
            {openSelector && (
              <div
                className={`dropdown-container max-h-28 overflow-y-auto overflow-x-hidden scrollbar shadow-md shadow-light200 border-t-2 border-t-light100 ${
                  userTasks.length === 1
                    ? "-top-50px"
                    : userTasks.length <= 2
                    ? "-top-20"
                    : userTasks.length <= 3
                    ? "-top-28"
                    : "-top-32"
                }`}
              >
                <ul
                  className="dropdown-list rounded"
                  onBlur={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    setOpenSelector(false)
                  }}
                >
                  {filterTaskList.map((id) => {
                    const task = totalTaskList[id]
                    const projectDetail = totalProjectList[task.projectID]
                    return (
                      <li
                        className="dropdown-item max-w-full truncate pb-2 border-b-1 border-b-light100 hover:text-white flex justify-between items-center "
                        value={task.id}
                        key={task.id}
                        onClick={() => {
                          openTaskPage(task.id)
                          setOpenSelector(false)
                        }}
                      >
                        <div className="">
                          <small className="mb-3 p-1 rounded bg-blue100 text-white ">
                            {projectDetail.title}
                          </small>
                          <p className="p-1">{task.title}</p>
                        </div>
                        <div className="">
                          <PlayCircle size={35} strokeWidth={1} />
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      <button
        className="bg-slateLight text-white py-2 px-3 rounded flex items-center gap-2"
        onClick={createNewTask}
        id="createTaskButton"
      >
        <Plus size={16} />
        Task
      </button>
    </div>
  )
}

export default TaskList
