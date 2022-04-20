import { useState, createContext } from "react"
import { firebase } from "../helpers/firebase"

export const initialTagState = {
  tags: [
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
