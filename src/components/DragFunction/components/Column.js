import React from "react"
import { Droppable } from "react-beautiful-dnd"
import Task from "./Task"
import { array, object, string } from "prop-types"

const Column = ({ column, taskList, type }) => {
  return (
    <div className={`column column-${type}`}>
      <h1 className={`tag`}>{column.title}</h1>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => {
          const isDraggingOver = snapshot.isDraggingOver
            ? `column-${type}-dragging`
            : `column-${type}-normal`
          return (
            <div
              className={`${isDraggingOver} h-custom-xl overflow-y-auto`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {taskList &&
                taskList.map((item, index) => (
                  <Task key={item.id} task={item} index={index} type={type} />
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
  column: object.isRequired,
  taskList: array.isRequired,
  type: string.isRequired,
}

export default Column
