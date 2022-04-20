import React, { useCallback, useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import Column from "./styles/Column"

// const result = {
//   combine: null,
//   draggableId: "Go to supermarket",
//   mode: "FLUID",
//   reason: "DROP",
//   source: { index: 1, droppableId: "7" },
//   destination: { droppableId: "7", index: 2 },
//   type: "DEFAULT",
// }
const firebaseTags = [
  {
    id: "1",
    type: "priority",
    child: [
      {
        id: "1",
        name: "urgent",
      },
      { id: "3", name: "high" },
      { id: "4", name: "normal" },
      { id: "5", name: "low" },
    ],
  },
  {
    id: "2",
    type: "progress",
    child: [
      { id: "6", name: "none" },
      { id: "7", name: "todo" },
      { id: "8", name: "doing" },
      { id: "9", name: "done" },
    ],
  },
]
const columns = {
  none: {
    id: "6",
    title: "none",
    taskIds: [],
  },
  todo: {
    id: "7",
    title: "todo",
    taskIds: [],
  },
  doing: {
    id: "8",
    title: "doing",
    taskIds: [],
  },
  done: {
    id: "9",
    title: "done",
    taskIds: [],
  },
}
const initialTasks = [
  {
    title: "Buy apple",
    id: "111a", //draggable id
    projectID: "",
    tags: [
      {
        parent: "2",
        child: "6",
        type: "progress",
        index: 0,
      },
    ],
  },
  {
    title: "Play music",
    id: "222b", //draggable id
    projectID: "",
    tags: [
      {
        parent: "2",
        child: "7",
        type: "progress",
        index: 1,
      },
    ],
  },
  {
    title: "Eat an orange",
    id: "333c", //draggable id
    projectID: "",
    tags: [
      {
        parent: "2",
        child: "8",
        type: "progress",
        index: 2,
      },
    ],
  },
  {
    title: "Prepare for quiz",
    id: "444d", //draggable id
    projectID: "",
    tags: [
      {
        parent: "2",
        child: "9",
        type: "progress",
        index: 3,
      },
    ],
  },
  {
    title: "Go to supermarket",
    id: "555e", //draggable id
    projectID: "",
    tags: [
      {
        parent: "2",
        child: "7",
        type: "progress",
        index: 4,
      },
    ],
  },
  {
    title: "Wait for sun rise",
    id: "666f", //draggable id
    projectID: "",
    tags: [
      {
        parent: "2",
        child: "7",
        type: "progress",
        index: 5,
      },
    ],
  },
  {
    title: "Sleeeeeep",
    id: "777g", //draggable id
    projectID: "",
    tags: [
      {
        parent: "2",
        child: "6",
        type: "progress",
        index: 6,
      },
    ],
  },
]

// const dragTask = {
//   draggableID: "taskID",
//   type: "TYPE",
//   reason: "DROP",
//   source: {
//     droppableID: "tags[group].parent",
//     index: 0, //tags.index
//   },
//   destination: {
//     droppableID: "c1",
//     index: 1,
//   },
// }

const index = () => {
  const groupType = "progress"
  //   const currentColumnID = "7"
  const [tasks, setTasks] = useState(initialTasks)
  const [columns, setColumns] = useState(() => {
    const columnGroup = firebaseTags
      .find((tag) => tag.type === groupType)
      .child.map((tag) => {
        const currentTasks = tasks.filter((task) => {
          const hasCurrentTag =
            task.tags.find(
              (taskTag) => taskTag.type === groupType && taskTag.child === tag.id
            )?.child === tag.id
          if (hasCurrentTag) return task
        })
        tag.taskIds = currentTasks.map((task) => task.id)
        return tag
      })
    return columnGroup
  })
  const [columnOrder, setColumnOrder] = useState(() => {
    const orderArray = columns.map((item) => item.id)
    return orderArray
  })
  const onDragEnd = useCallback((result) => {
    const { destination, draggableId, source } = result
    if (!destination) return
    if (
      destination.droppableID === source.droppableID &&
      destination.index === source.index
    )
      return
    const dropAtColumn = columns.find((column) => column.id === source.droppableId)
    const newTaskIds = [...dropAtColumn.taskIds]
    newTaskIds.splice(source.index, 1)
    newTaskIds.splice(destination.index, 0, draggableId) //taskID

    const newColumn = {
      ...dropAtColumn,
      taskIds: newTaskIds,
    }
    setColumns((prev) => {
      const oldColumns = [...prev]
      const currentIndex = oldColumns.findIndex((column) => column.id === dropAtColumn.id)
      oldColumns.splice(currentIndex, 1, newColumn)
      return [...oldColumns]
    })
  }, [])

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {columnOrder.map((columnId) => {
        const column = columns.find((item) => item.id === columnId)
        const taskList = column.taskIds.map((taskId) =>
          tasks.find((task) => task.id === taskId)
        )
        return <Column key={column.id} column={column} taskList={taskList} />
      })}
    </DragDropContext>
  )
}

export default index
