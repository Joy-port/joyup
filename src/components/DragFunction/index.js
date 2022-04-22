import React, { useCallback, useContext, useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { TagsContext } from "../../reducers/TagsReducer"
import Column from "./components/Column"

const index = ({ type }) => {
  const [tagsState, tagsDispatch] = useContext(TagsContext)
  const { selectedTagColumns, selectedColumnOrder, selectedTagTasks } = tagsState
  // const [tasks, setTasks] = useState(tagsState.selectedTagTasks)
  // const groupType = "progress"
  // const [columns, setColumns] = useState(() => {
  //   const columns = {}
  //   tagsState.tags
  //     .find((tag) => tag.type === groupType)
  //     .children.forEach((tag) => {
  //       const currentTasks = tasks.filter((task) => {
  //         const hasCurrentTag =
  //           task.tags.find(
  //             (taskTag) => taskTag.type === groupType && taskTag.child === tag.id
  //           )?.child === tag.id
  //         if (hasCurrentTag) return task
  //       })
  //       tag.taskIds = currentTasks.map((task) => task.id)
  //       columns[tag.id] = tag
  //     })
  //   return { ...columns }
  // })

  //change columns into map
  // const [columnOrder, setColumnOrder] = useState(() => {
  //   return Object.keys(columns)
  // })
  console.log(selectedTagTasks)
  const onDragEnd = useCallback((result) => {
    const { destination, draggableId, source } = result
    if (!destination) return
    if (
      destination.droppableID === source.droppableID &&
      destination.index === source.index
    )
      return
    const startAtColumn = columns[source.droppableId]
    const finishAtColumn = columns[destination.droppableId]

    if (startAtColumn.id === finishAtColumn.id) {
      const newTaskIds = [...startAtColumn.taskIds]
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...startAtColumn,
        taskIds: newTaskIds,
      }
      setColumns((prev) => {
        return { ...prev, [newColumn.id]: newColumn }
      })
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
      setColumns((prev) => {
        return {
          ...prev,
          [newStartColumn.id]: newStartColumn,
          [newFinishColumn.id]: newFinishColumn,
        }
      })
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
