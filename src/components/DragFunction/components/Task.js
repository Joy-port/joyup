import React from "react"
import { useNavigate } from "react-router-dom"
import { Draggable } from "react-beautiful-dnd"
import { number, object, string } from "prop-types"
import { Menu } from "react-feather"
import { useDispatch, useSelector } from "react-redux"

const Task = ({ task, index, type }) => {
  const navigate = useNavigate()
  const { totalTaskList } = useSelector((state) => state.projects)
  const dispatch = useDispatch()
  const onClick = (taskID) => {
    const taskDetail = JSON.parse(JSON.stringify(totalTaskList[taskID]))
    dispatch({ type: "task/openSavedTask", payload: taskDetail })
    navigate(`/tasks/${task.id}`)
  }
  const draggingTop = type === "list" ? 0 : 0 //200 176 //200
  const draggingLeft = type === "list" ? 0 : 100
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => {
        const isDragging = snapshot.isDragging ? `task-${type}-dragging` : ""
        const dragging = snapshot.isDragging
          ? {
              ...provided.draggableProps.style,
              top: `calc(provided.draggableProps.style.top - ${draggingTop}px)`,
              left: `calc(provided.draggableProps.style.top - ${draggingLeft}px)`,
            }
          : { ...provided.draggableProps.style }
        return (
          <div
            className={`task task-${type} ${isDragging} transition-shadow cursor-pointer`}
            {...provided.draggableProps}
            ref={provided.innerRef}
            style={dragging}
            onClick={() => onClick(task.id)}
          >
            <div className="flex gap-3 items-center truncate">{task.title}</div>
            <div className="z-over-draggable px-3" {...provided.dragHandleProps}>
              <Menu strokeWidth={1} size={20} />
            </div>
          </div>
        )
      }}
    </Draggable>
  )
}
Task.propTypes = {
  task: object.isRequired,
  index: number.isRequired,
  type: string.isRequired,
}

export default Task
