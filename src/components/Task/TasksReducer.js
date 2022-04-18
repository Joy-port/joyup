import React, { useState, useReducer, useContext, createContext } from "react"

const initialState = {
  title: "",
  description: [],
  createdDate: new Date(),
  startDate: new Date(),
  dueDate: new Date(),
  clockNumber: "",
  requiredClockNumber: "",
  location: "",
  parent: "",
  id: "",
  projectID: "",
}

export function reducer(state, action) {
  switch (action.type) {
    case "editDate":
      const { type, date } = action.payload
      return { ...state, [type]: date }
    case "saveDescription":
      return { ...state, description: [...action.payload] }
    default:
      return state
  }
}

// export function useTasksReducer(reducer, initialState) {
//   const [state, setState] = useState(initialState)

//   function dispatch(action) {
//     const nextState = reducer(state, action)
//     setState(nextState)
//   }

//   return [state, dispatch]
// }

const TasksContent = React.createContext([])
// export const useTasksContext = () => useContext(TasksContent)

// eslint-disable-next-line react/prop-types
// export const TextProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(reducer, initialState)
//   const value = [state, dispatch]
//   return <TasksContent.Provider value={value}>{children}</TasksContent.Provider>
// }

export default TasksContent
