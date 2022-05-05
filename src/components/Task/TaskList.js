import React, { useState, useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import { Plus, FileText } from "react-feather"

const TaskList = () => {
  const dispatch = useDispatch()
  const task = useSelector((state) => state.task)
  const { totalTaskList } = useSelector((state) => state.projects)
  const { userTasks } = useSelector((state) => state.user)
  let navigate = useNavigate()
  const [taskID, setTaskID] = useState("")
  const [openSelector, setOpenSelector] = useState(false)
  const createNewTask = useCallback(() => {
    const newTaskID = uuidv4()
    setTaskID(newTaskID)
    dispatch({ type: "createNewTask", payload: newTaskID })
  })
  useEffect(() => {
    navigate(`/task/${taskID}`)
  }, [taskID])

  const onClick = (taskID) => {
    const taskDetail = JSON.parse(JSON.stringify(totalTaskList[taskID]))
    dispatch({ type: "task/openSavedTask", payload: taskDetail })
    navigate(`/task/${taskID}`)
  }
  //py-2 px-3 w-32
  return (
    <div className="fixed bottom-5 right-5 z-100 bg-transparent flex gap-2">
      <div className="text-center rounded button-outline-light min-w-32 max-w-72">
        <div className="group-title relative w-44 py-2 px-3 rounded">
          <p
            className="flex gap-2 rounded -my-2 -mx-3 py-2 px-3 bg-slateLight text-white cursor-pointer"
            onClick={() => {
              setOpenSelector(!openSelector)
            }}
          >
            <FileText />
            {task.title || "Task List"}
          </p>
          {openSelector && (
            <div className="dropdown-container -top-32 h-28 overflow-auto">
              <ul className="dropdown-list rounded">
                {userTasks.map((id) => {
                  const task = totalTaskList[id]
                  return (
                    <li
                      className="dropdown-item"
                      value={task.id}
                      key={task.id}
                      onClick={() => {
                        onClick(task.id)
                        setOpenSelector(false)
                      }}
                    >
                      {task.title}
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
      {/* <select
        className="bg-slateLight rounded text-white border-r-2 py-2 px-3 w-32"
        onChange={(e) => onChange(e)}
      >
        <option className="flex gap-2" value="default">
          Task List
        </option>
        {userTasks &&
          userTasks.map((taskID) => {
            const task = totalTaskList[taskID]
            if (!task) return
            return (
              <option value={task.id} key={task.id} className="w-full truncate">
                {task.title}
              </option>
            )
          })}
      </select> */}
      <button
        className="bg-slateLight text-white py-2 px-3 rounded flex items-center gap-2"
        onClick={createNewTask}
      >
        <Plus size={16} />
        Task
      </button>
    </div>
  )
}

export default TaskList
