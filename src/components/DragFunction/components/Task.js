import React from "react"
import { Draggable } from "react-beautiful-dnd"
import { number, object } from "prop-types"
import { List } from "react-feather"

const Task = ({ task, index }) => {
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
            {task.title}
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
