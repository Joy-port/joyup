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
        return (
          <div
            className={`task task-${type} ${isDragging}`}
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <div
              className="grow cursor-pointer flex gap-3 items-center"
              onClick={() => onClick(task.id)}
            >
              <Edit3 strokeWidth={1} size={18} />
              {task.title}
            </div>
            <div {...provided.dragHandleProps}>
              <Menu strokeWidth={1} />
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
