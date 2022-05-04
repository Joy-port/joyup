import React, { useCallback } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { useDispatch, useSelector } from "react-redux"
import Column from "./components/Column"
import { tags } from "../../sliceReducers/actions/tags"

const index = ({ type }) => {
  const { selectedTagColumns, selectedColumnOrder, selectedTagTasks, selectedType } =
    useSelector((state) => state.tags)
  const dispatch = useDispatch()
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
      dispatch(tags.updateTagOrder(newColumn))
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
      const taskContent = {
        taskId: draggableId,
        parent: selectedType.id,
        child: finishAtColumn.id,
        type: selectedType.type,
      }
      dispatch(tags.updateTagsForTask(taskContent))
      dispatch(tags.updateTagOrder(newStartColumn))
      dispatch(tags.updateTagOrder(newFinishColumn))
    }
  })

  return (
    <div className={`view-${type}`}>
      <DragDropContext onDragEnd={onDragEnd}>
        {selectedColumnOrder &&
          selectedColumnOrder.map((columnId) => {
            const column = selectedTagColumns[columnId]
            if (!column?.taskIds) {
              return (
                <Column
                  key={column.id}
                  column={column}
                  taskList={column?.taskIds}
                  type={type}
                />
              )
            } else {
              const taskList = column.taskIds
                .map((taskId) => selectedTagTasks.find((task) => task.id === taskId))
                .filter((task) => task !== undefined)
              if (taskList) {
                return (
                  <Column
                    key={column.id}
                    column={column}
                    taskList={taskList}
                    type={type}
                  />
                )
              }
            }
          })}
      </DragDropContext>
    </div>
  )
}

export default index
