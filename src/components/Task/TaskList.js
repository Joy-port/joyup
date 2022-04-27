import React, { useState, useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
// import { TagsContext } from "../../reducers/TagsReducer"
// import { TaskContext } from "../../reducers/TaskReducer"

const TaskList = () => {
  // const [state, dispatch] = useContext(TaskContext)
  // const [tagState, tagDispatch] = useContext(TagsContext)
  const dispatch = useDispatch()
  const { id, projectID } = useSelector((state) => state.task)
  const { totalTaskList, userProjects } = useSelector((state) => state.user)
  const { totalTasksToSelect } = useSelector((state) => state.tags)
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
  useEffect(() => {
    console.log(totalTaskList)
  }, [totalTaskList])

  const onChange = (e) => {
    console.log(e.target.value)
    const taskID = e.target.value
    // const taskDetail = totalTaskList[taskID]
    // console.log(taskDetail)
    navigate(`/task/${taskID}`)
  }
  return (
    <div className="fixed bottom-5 right-5 ">
      <select
        className="bg-slateDark text-white border-r-2 py-1 px-2"
        value={id}
        onChange={(e) => onChange(e)}
      >
        <option value="default">Select A Task and Start</option>
        {totalTasksToSelect &&
          totalTasksToSelect.map((taskID) => {
            const task = totalTaskList[taskID]
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
