import { useState, createContext } from "react"

export const initialTaskState = {
  title: "",
  description: [],
  createdDate: new Date(),
  startDate: new Date(),
  dueDate: new Date(),
  clockNumber: "",
  requiredClockNumber: -1,
  location: "",
  parent: "",
  id: "",
  projectID: "",
  tags: {},
}

export function taskReducer(state = initialTaskState, action) {
  switch (action.type) {
    case "editDate":
      const { type, date } = action.payload
      return { ...state, [type]: date }
    case "editDescription":
      return { ...state, description: [...action.payload] }
    case "requiredClock":
      return { ...state, requiredClockNumber: action.payload }
    case "setTaskID":
      return { ...state, id: action.payload }
    case "setTitle":
      return { ...state, title: action.payload }
    case "setLocation":
      return { ...state, location: action.payload }
    case "editTags":
      return { ...state, tags: { ...action.payload } }
    case "createNewTask":
      return { ...initialTaskState, id: action.payload }
    default:
      return state
  }
}

export function useTasksReducer(reducer = taskReducer, initialState = initialTaskState) {
  const [state, setState] = useState(initialState)

  function dispatch(action) {
    const nextState = reducer(state, action)
    setState(nextState)
  }

  return [state, dispatch]
}

const TasksContext = createContext()
// export const useTasksContext = () => useContext(TasksContent)

// eslint-disable-next-line react/prop-types
// export const TextProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(reducer, initialState)
//   const value = [state, dispatch]
//   return <TasksContent.Provider value={value}>{children}</TasksContent.Provider>
// }

export default TasksContext
