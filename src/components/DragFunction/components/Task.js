import React from "react"
import { useNavigate } from "react-router-dom"
import { Draggable } from "react-beautiful-dnd"
import { number, object } from "prop-types"
import { List } from "react-feather"
import { useDispatch, useSelector } from "react-redux"

const Task = ({ task, index }) => {
  const navigate = useNavigate()
  const { totalTaskList } = useSelector((state) => state.projects)
  const dispatch = useDispatch()
  const onClick = (taskID) => {
    const taskDetail = totalTaskList[taskID]
    dispatch({ type: "task/openSavedTask", payload: taskDetail })
    navigate(`/task/${task.id}`)
  }
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => {
        const isDragging = snapshot.isDragging ? "bg-slateLight text-white" : "bg-white"
        return (
          <div
            className={`task ${isDragging}`}
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <div className="grow cursor-pointer" onClick={() => onClick(task.id)}>
              {task.title}
            </div>
            <div {...provided.dragHandleProps}>
              <List />
            </div>
          </div>
        )
      }}
    </Draggable>
  )
}
Task.propTypes = {
  task: object,
  index: number,
}

export default Task
