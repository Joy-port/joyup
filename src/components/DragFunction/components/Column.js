import React from "react"
import { Droppable } from "react-beautiful-dnd"
import Task from "./Task"
import { array, object } from "prop-types"

const Column = ({ column, taskList }) => {
  return (
    <div className="column view-board-column">
      <h1 className="heading-four">{column.name}</h1>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => {
          const isDraggingOver = snapshot.isDraggingOver ? "bg-blue" : "bg-white"
          return (
            <div
              className={`task-list ${isDraggingOver}`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {taskList &&
                taskList.map((item, index) => (
                  <Task key={item.id} task={item} index={index} />
                ))}
              {provided.placeholder}
            </div>
          )
        }}
      </Droppable>
    </div>
  )
}
Column.propTypes = {
  column: object,
  taskList: array,
}

export default Column
