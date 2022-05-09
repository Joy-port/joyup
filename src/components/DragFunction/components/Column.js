import React from "react"
import { Droppable } from "react-beautiful-dnd"
import Task from "./Task"
import { array, object, string } from "prop-types"

const Column = ({ column, taskList, type }) => {
  return (
    <div
      className={`column column-${type} ${
        taskList.length <= 0 && type === "list" ? "hidden" : ""
      }`}
    >
      <h1 className={`tag`}>{column.title}</h1>
      <Droppable
        droppableId={column.id}
        style={{ overflowY: "auto" }}
        className={`${type === "list" ? "min-h-20" : "overflow-y-auto"}`}
      >
        {(provided, snapshot) => {
          const styleType = type === "list" ? "px-2 pb-2 rounded-sm" : ""
          const isDraggingOver = snapshot.isDraggingOver
            ? `column-${type}-dragging`
            : `column-${type}-normal`
          return (
            <div
              className={`${isDraggingOver} ${styleType} `}
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
