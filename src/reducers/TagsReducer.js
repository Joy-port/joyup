import { useState, createContext } from "react"
import { firebase } from "../helpers/firebase"

const initialTotalTags = [
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
const initalSelectedColumns = {
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
  totalTags: [
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
  ],
  selectedTag: {
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
  selectedTagColumns: {
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
  },
}

export function tagReducer(state = initialTagState, action) {
  switch (action.type) {
    case "getTags":
      return { ...state, [type]: date }
    default:
      return state
  }
}

export function useTagsReducer(reducer = tagReducer, initialState = initialTagState) {
  const [state, setState] = useState(initialState)

  function dispatch(action) {
    const nextState = reducer(state, action)
    setState(nextState)
  }

  return [state, dispatch]
}

const TagsContext = createContext()
// export const useTagsContext = () => useContext(TasksContent)

// eslint-disable-next-line react/prop-types
// export const TextProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(reducer, initialState)
//   const value = [state, dispatch]
//   return <TasksContent.Provider value={value}>{children}</TasksContent.Provider>
// }

export default TagsContext
