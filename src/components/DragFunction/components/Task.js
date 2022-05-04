import React from "react"
import { useNavigate } from "react-router-dom"
import { Draggable } from "react-beautiful-dnd"
import { number, object, string } from "prop-types"
import { List } from "react-feather"
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
        return (
          <div
            className={`task task-${type} ${isDragging}`}
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <div className="grow cursor-pointer" onClick={() => onClick(task.id)}>
              {task.title}
            </div>
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
  type: string,
}

export default Task
