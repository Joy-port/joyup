import React from "react"
import { Draggable } from "react-beautiful-dnd"
import { Menu } from "react-feather"
import { number, object, string } from "prop-types"
import useOpenTaskPage from "../../../hooks/useOpenTaskPage"

const Task = ({ task, index, type }) => {
  const openTaskPage = useOpenTaskPage()
  const draggingTop = type === "list" ? 0 : 0
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
            className={`task task-${type} ${isDragging} transition-shadow cursor-pointer border-b-1 border-b-light100`}
            {...provided.draggableProps}
            ref={provided.innerRef}
            style={dragging}
            onClick={() => openTaskPage(task.id)}
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
