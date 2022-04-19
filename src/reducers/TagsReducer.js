import { useState, createContext } from "react"
import { firebase } from "../helpers/firebase"

export const initialTagState = {
  type: [],
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
