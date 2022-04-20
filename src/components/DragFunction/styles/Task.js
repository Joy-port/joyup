import React from "react"
import { Draggable } from "react-beautiful-dnd"
import { number, object } from "prop-types"

const Task = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className="task"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {task.title}
        </div>
      )}
    </Draggable>
  )
}
Task.propTypes = {
  task: object,
  index: number,
}

export default Task
