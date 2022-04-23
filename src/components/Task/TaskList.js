import React, { useState, useContext, useCallback, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import { TagsContext } from "../../reducers/TagsReducer"
import { TaskContext } from "../../reducers/TaskReducer"

const TaskList = () => {
  const [state, dispatch] = useContext(TaskContext)
  const [tagState, tagDispatch] = useContext(TagsContext)
  const [taskLists, setTaskLists] = useState(tagState.totalTagTasks)
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

  const onChange = () => {}
  return (
    <div className="fixed bottom-5 right-5 ">
      <select
        className="bg-slateDark text-white border-r-2 py-1 px-2"
        onChange={onChange}
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
        + Task
      </button>
    </div>
  )
}

export default TaskList
