import React, { useState, useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"

const TaskList = () => {
  const dispatch = useDispatch()
  const { id } = useSelector((state) => state.task)
  const { totalTaskList } = useSelector((state) => state.projects)
  const { userTasks } = useSelector((state) => state.user)
  let navigate = useNavigate()
  const [taskID, setTaskID] = useState("")
  const createNewTask = useCallback(() => {
    const newTaskID = uuidv4()
    setTaskID(newTaskID)
    dispatch({ type: "createNewTask", payload: newTaskID })
  })
  useEffect(() => {
    navigate(`/task/${taskID}`)
  }, [taskID])

  const onChange = (e) => {
    const taskID = e.target.value
    const taskDetail = JSON.parse(JSON.stringify(totalTaskList[taskID]))
    dispatch({ type: "task/openSavedTask", payload: taskDetail })
    navigate(`/task/${taskID}`)
  }
  return (
    <div className="fixed bottom-5 right-5 z-100 bg-transparent">
      <select
        className="bg-slateLight rounded-sm text-white border-r-2 py-2 px-3 w-32"
        onChange={(e) => onChange(e)}
      >
        <option value="default">Tasks</option>
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
      </select>
      <button
        className="bg-slateLight text-white py-2 px-3  rounded-sm"
        onClick={createNewTask}
      >
        + Task
      </button>
    </div>
  )
}

export default TaskList
