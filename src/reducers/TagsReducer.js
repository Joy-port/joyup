import { any, string } from "prop-types"
import React, { createContext, useEffect } from "react"
import { useAsyncReducer } from "../helpers/useAsyncReducer"
import { firebase } from "../helpers/firebase"

function separateTasks(totalTasks, selectedTypeId) {
  const selectedTypeTask = []
  const noneGroupTask = []
  if (!selectedTypeId) return [selectedTypeTask, noneGroupTask, totalTasks]
  totalTasks.forEach((task) => {
    const hasCurrentTypeTask = task.tags.some((tag) => tag.parent === selectedTypeId)
    if (hasCurrentTypeTask) {
      console.log(task.tags, task.title)
      selectedTypeTask.push(task)
      return
    }
    noneGroupTask.push(task)
  })
  return [selectedTypeTask, noneGroupTask, totalTasks]
}

function matchTagTaskIds(tagId, projectTagsList) {
  return projectTagsList[tagId]
}
const initialTotalTags = [
  {
    id: "1",
    type: "priority",
    children: [
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
    children: [
      { id: "6", name: "none" },
      { id: "7", name: "todo" },
      { id: "8", name: "doing" },
      { id: "9", name: "done" },
    ],
  },
]
const initialSelectedColumns = {
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

export const initialTagState = {
  projectID: "8gx8UcCs8cLC8V8s2SMK",
  types: [],
  selectedType: {},
  selectedTagColumns: {},
  selectedTagTasks: [],
  noneTagTasks: [],
  selectedColumnOrder: [],
  totalTagTasks: [],
  projectTagsOrderList: {},
}

const defaultNoneTagList = {
  id: "noTagTasks",
  title: "no grouped tasks",
  taskIds: [],
}

async function tagReducer(state = initialTagState, action) {
  switch (action.type) {
    case "getTags":
      return { ...state, [type]: date }
    case "getInitialTags":
      // disconnect to firebase
      // const defaultTagList = initialTotalTags
      // const totalProjects = initialTasks
      // connect to firebase
      const projectID = "8gx8UcCs8cLC8V8s2SMK"
      const totalProjects = await firebase.getProjectTasks(projectID)
      const defaultTagList = await firebase.getDefaultTags(projectID)
      const projectTagContent = await firebase.getProjectTags(projectID)

      const newTagList = [...defaultTagList]
      const newSelectedType = newTagList[0]
      const newColumns = {}
      const [selectedTask, noneTask] = separateTasks(totalProjects, newSelectedType.id)
      newSelectedType.children.map((tagChild) => {
        const currentTagTaskIds = matchTagTaskIds(tagChild.id, projectTagContent)
        newColumns[tagChild.id] = {
          id: tagChild.id,
          title: tagChild.name,
          taskIds: [...currentTagTaskIds],
        }
      })
      const newColumnOrder = Object.keys(newColumns)

      return {
        ...state,
        types: newTagList,
        selectedType: newSelectedType,
        selectedTagColumns: newColumns,
        selectedColumnOrder: newColumnOrder,
        totalTagTasks: totalProjects,
        selectedTagTasks: selectedTask,
        noneTagTasks: noneTask,
        projectTagsOrderList: projectTagContent,
      }
    case "switchType":
      const typeId = action.payload
      const totalTasks = [...state.selectedTagTasks]
      const newType = state.types.find((type) => typeId === type.id)
      const [selectedTypeTask, noneGroupTask] = separateTasks(totalTasks, newType.id)

      let newTagsColumns = {}
      newType.children.forEach((tag) => {
        const newTypeTaskIds = matchTagTaskIds(tag.id, state.projectTagsOrderList)
        newTagsColumns[tag.id] = {
          id: tag.id,
          title: tag.name,
          taskIds: newTypeTaskIds,
        }
      })
      const newOrder = Object.keys(newTagsColumns)
      return {
        ...state,
        selectedType: { ...newType },
        selectedTagColumns: { ...newTagsColumns },
        selectedColumnOrder: [...newOrder],
        selectedTagTasks: selectedTypeTask,
        noneTagTasks: noneGroupTask,
      }
    case "switchProject":
      const { pid } = action.payload
      return { ...state, projectID: pid }
    case "getProjectTasks":
      const selectedProjectID = "8gx8UcCs8cLC8V8s2SMK"
      const allTasks = await firebase.getProjectTasks(selectedProjectID)
      return { ...state, selectedTagTasks: allTasks }
    case "switchTagForTask":
      const columnContent = { ...action.payload }
      const { selectedTagColumns } = state
      selectedTagColumns[columnContent.id] = columnContent
      firebase.saveTaskOrder(state.projectID, columnContent)
      return { ...state, selectedTagColumns }
    case "removeTag":
      const [removedTaskID, removedTagId] = action.payload
      const newNoTagList = state.noneGroupTask.push(
        state.selectedTagTasks.find((item) => item.id === removedTaskID)
      )
      const newSelectedList = state.selectedTagTasks.filter(
        (item) => item.id !== removedTagId
      )
      return {
        ...state,
        selectedTagColumns: newSelectedList,
        noneGroupTask: newNoTagList,
      }
    default:
      return state
  }
}

export const TagsContext = createContext()
const TagsProvider = ({ children }) => {
  const [state, dispatch] = useAsyncReducer(tagReducer, initialTagState)

  useEffect(() => {
    dispatch({ type: "getInitialTags" })
  }, [])

  return <TagsContext.Provider value={[state, dispatch]}>{children}</TagsContext.Provider>
}

TagsProvider.propTypes = {
  children: any,
  projectID: string,
}
export default TagsProvider
