import React, { useState, useContext, useCallback, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import TasksContent from "../../reducers/TasksReducer"

const TaskList = () => {
  const [state, dispatch] = useContext(TasksContent)
  const [taskLists, setTaskLists] = useState([])
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

  return (
    <div className="fixed bottom-5 right-5 ">
      <select
        className="bg-slateDark text-white border-r-2 py-1 px-2"
        name=""
        id=""
        value="default"
      >
        <option value="default">Select A Task and Start</option>
        {taskLists &&
          taskLists.map((item) => (
            <option value={item.id} key={item.id}>
              {item.title}
            </option>
          ))}
      </select>
      <button className="bg-slateDark text-white py-1 px-2" onClick={createNewTask}>
        Create Task
      </button>
    </div>
  )
}

export default TaskList
