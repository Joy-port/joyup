import React, { useState, useCallback, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import { Plus, Clock } from "react-feather"

const TaskList = () => {
  const dispatch = useDispatch()
  const task = useSelector((state) => state.task)
  const { totalTaskList, totalProjectList } = useSelector((state) => state.projects)
  const { userTasks, userProjects } = useSelector((state) => state.user)
  let navigate = useNavigate()
  let { pathname } = useLocation()
  const [openSelector, setOpenSelector] = useState(false)
  const createNewTask = () => {
    if (userProjects.length < 1) {
      // alert("please create a new project before add a new task")
      dispatch({
        type: "alert/status",
        payload: {
          text: "please create a new project before add a new task",
          type: "info",
        },
      })
      if (!pathname.includes("dashboard")) {
        navigate("/dashboard")
      }
      return
    }
    const newTaskID = uuidv4()
    dispatch({ type: "task/createNewTask", payload: newTaskID })
    navigate(`/tasks/${newTaskID}`)
  }

  const openTask = (taskID) => {
    const taskDetail = JSON.parse(JSON.stringify(totalTaskList[taskID]))
    dispatch({ type: "task/openSavedTask", payload: taskDetail })
    navigate(`/clocks/${taskID}`)
  }
  const filterTaskList = () => {
    const newTaskList = userTasks.filter((taskID) => {
      const taskDetail = totalTaskList[taskID]
      const taskDueDate = new Date(taskDetail.dueDate).getDate()
      taskDueDate >= new Date().getDate()
    })
    console.log(newTaskList)
    return newTaskList
  }
  //py-2 px-3 w-32
  return (
    <>
      {userTasks.length !== 0 && userProjects.length !== 0 && (
        <div className="absolute bottom-5 right-5 z-100 bg-transparent flex gap-2">
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
                  navigate("/dashboard")
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
                  <ul className="dropdown-list rounded">
                    {userTasks.map((id) => {
                      const task = totalTaskList[id]
                      const taskDueDate = new Date(task.dueDate).getDate()
                      const projectDetail = totalProjectList[task.projectID]
                      if (taskDueDate <= new Date().getDate()) return
                      return (
                        <li
                          className="dropdown-item max-w-full truncate"
                          value={task.id}
                          key={task.id}
                          onClick={() => {
                            openTask(task.id)
                            setOpenSelector(false)
                          }}
                          onBlur={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            setOpenSelector(false)
                          }}
                        >
                          <small className="mb-2 block">{projectDetail.title}</small>
                          <p>{task.title}</p>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
            {/* <select
            value={selectedType.id || -1}
            onChange={(e) => dispatch(tags.switchType(e.target.value))}
          >
            <option value={-1}>please select</option>
            {types.map((type) => (
              <option value={type.id} key={type.id}>
                {type.type}
              </option>
            ))}
          </select> */}
          </div>
          <button
            className="bg-slateLight text-white py-2 px-3 rounded flex items-center gap-2"
            onClick={createNewTask}
            id="createTaskButton"
          >
            <Plus size={16} />
            Task
          </button>
        </div>
      )}
    </>
  )
}

export default TaskList
