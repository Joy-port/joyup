import React, { Fragment } from "react"
import { Droppable } from "react-beautiful-dnd"
import { array, object, string } from "prop-types"
import Task from "./Task"

const InnerTaskList = ({ taskList, type }) => {
  return (
    <Fragment>
      {taskList &&
        taskList.map((item, index) => (
          <Task key={item.id} task={item} index={index} type={type} />
        ))}
    </Fragment>
  )
}
function taskIsSameInColumn(prevProp, nextProp) {
  return prevProp.taskList === nextProp.taskList
}
const MemoTaskList = React.memo(InnerTaskList, taskIsSameInColumn)

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
        className={`${type === "list" ? "min-h-20" : "overflow-y-auto"}`}
      >
        {(provided, snapshot) => {
          const styleType = type === "list" ? "px-2 pb-2 rounded-sm" : ""
          const isDraggingOver = snapshot.isDraggingOver
            ? `column-${type}-dragging`
            : `column-${type}-normal`
          return (
            <div
              className={`${isDraggingOver} ${styleType} transition-transform`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <MemoTaskList taskList={taskList} type={type} />
              {provided.placeholder}
            </div>
          )
        }}
      </Droppable>
    </div>
  )
}

InnerTaskList.propTypes = {
  taskList: array.isRequired,
  type: string.isRequired,
}
Column.propTypes = {
  column: object.isRequired,
  taskList: array.isRequired,
  type: string.isRequired,
}

export default Column
