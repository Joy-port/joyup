import React from "react"
import { useNavigate } from "react-router-dom"
import { Draggable } from "react-beautiful-dnd"
import { number, object, string } from "prop-types"
import { Menu, Edit3 } from "react-feather"
import { useDispatch, useSelector } from "react-redux"

const Task = ({ task, index, type }) => {
  const navigate = useNavigate()
  const { totalTaskList } = useSelector((state) => state.projects)
  const dispatch = useDispatch()
  const onClick = (taskID) => {
    const taskDetail = JSON.parse(JSON.stringify(totalTaskList[taskID]))
    dispatch({ type: "task/openSavedTask", payload: taskDetail })
    navigate(`/task/${task.id}`)
  }
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => {
        const isDragging = snapshot.isDragging ? `task-${type}-dragging` : ""
        const draggingTop = type === "list" ? 200 : 176
        const draggingLeft = type === "list" ? 0 : 200
        const dragging = snapshot.isDragging
          ? {
              ...provided.draggableProps.style,
              top: `calc(provided.draggableProps.style.top - ${draggingTop}px)`,
              left: `calc(provided.draggableProps.style.top - ${draggingLeft}px)`,
            }
          : { ...provided.draggableProps.style }
        return (
          <div
            className={`task task-${type} ${isDragging} hide`}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={dragging}
          >
            <div className="cursor-pointer flex gap-3 items-center">{task.title}</div>
            <div
              className="rounded p-1 bg-light100 show z-over-draggable"
              onClick={() => onClick(task.id)}
            >
              <Edit3 strokeWidth={1} size={18} />
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
