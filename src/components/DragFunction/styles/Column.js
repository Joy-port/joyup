import React from "react"
import { Droppable } from "react-beautiful-dnd"
import Task from "./Task"
import { array, object } from "prop-types"

const Column = ({ column, taskList }) => {
  return (
    <div className="column">
      <h1 className="heading-four">{column.name}</h1>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div className="task-list" ref={provided.innerRef} {...provided.droppableProps}>
            {taskList &&
              taskList.map((item, index) => (
                <Task key={item.id} task={item} index={index} />
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
Column.propTypes = {
  column: object,
  taskList: array,
}

export default Column
