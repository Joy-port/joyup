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
    navigate(`/task/${taskID}`)
  }
  return (
    <div className="fixed bottom-5 right-5 z-100">
      <select
        className="bg-slateDark text-white border-r-2 py-1 px-2"
        onChange={(e) => onChange(e)}
      >
        <option value="default">Select A Task and Start</option>
        {userTasks &&
          userTasks.map((taskID) => {
            const task = totalTaskList[taskID]
            if (!task) return
            return (
              <option value={task.id} key={task.id}>
                {task.title}
              </option>
            )
          })}
      </select>
      <button className="bg-slateDark text-white py-1 px-2" onClick={createNewTask}>
        + Task
      </button>
    </div>
  )
}

export default TaskList
