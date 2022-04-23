import React, { useCallback, useContext, useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { TaskContext } from "../../reducers/TaskReducer"
import { TagsContext } from "../../reducers/TagsReducer"
import Column from "./components/Column"

const index = ({ type }) => {
  const [taskState, taskDispatch] = useContext(TaskContext)
  const [tagsState, tagsDispatch] = useContext(TagsContext)
  const { selectedTagColumns, selectedColumnOrder, selectedTagTasks, selectedType } =
    tagsState
  const onDragEnd = useCallback((result) => {
    const { destination, draggableId, source } = result
    if (!destination) return
    if (
      destination.droppableID === source.droppableID &&
      destination.index === source.index
    )
      return
    const startAtColumn = selectedTagColumns[source.droppableId]
    const finishAtColumn = selectedTagColumns[destination.droppableId]

    if (startAtColumn.id === finishAtColumn.id) {
      const newTaskIds = [...startAtColumn.taskIds]
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...startAtColumn,
        taskIds: newTaskIds,
      }
      taskDispatch({
        type: "editTags",
        payload: {
          parent: selectedType.id,
          child: finishAtColumn.id,
          type: selectedType.type,
          index: destination.index,
        },
      })
      tagsDispatch({ type: "switchTagForTask", payload: newColumn })
    } else {
      const startColumnTaskIds = [...startAtColumn.taskIds]
      startColumnTaskIds.splice(source.index, 1)
      const newStartColumn = {
        ...startAtColumn,
        taskIds: startColumnTaskIds,
      }
      const finishColumnTaskIds = [...finishAtColumn.taskIds]
      finishColumnTaskIds.splice(destination.index, 0, draggableId)
      const newFinishColumn = {
        ...finishAtColumn,
        taskIds: finishColumnTaskIds,
      }

      taskDispatch({
        type: "editTags",
        payload: {
          parent: selectedType.id,
          child: finishAtColumn.id,
          type: selectedType.type,
          index: destination.index,
        },
      })
      tagsDispatch({ type: "switchTagForTask", payload: newStartColumn })
      tagsDispatch({ type: "switchTagForTask", payload: newFinishColumn })
    }
  })

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={`view-${type}`}>
        {selectedColumnOrder &&
          selectedColumnOrder.map((columnId) => {
            const column = selectedTagColumns[columnId]
            if (!column?.taskIds) {
              return <Column key={column.id} column={column} taskList={column?.taskIds} />
            } else {
              const taskList = column.taskIds.map((taskId) =>
                selectedTagTasks.find((task) => task.id === taskId)
              )
              return <Column key={column.id} column={column} taskList={taskList} />
            }
          })}
      </div>
    </DragDropContext>
  )
}

export default index
