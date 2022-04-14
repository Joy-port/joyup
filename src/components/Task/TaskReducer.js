import React, { useReducer, useContext, createContext } from "react"

const initialState = {
  title: "",
  description: {},
  createdDate: "",
  dueDate: "",
  clockNumber: "",
  requiredClockNumber: "",
  location: "",
  parent: "",
  id: "",
  projectID: "",
}

export function reducer(state, action) {
  switch (action.type) {
    case "editText":
      return { ...state, title: "" }
    default:
      return state
  }
}

export const TaskContent = createContext()
export const useTaskContext = () => useContext(TaskContent)

// eslint-disable-next-line react/prop-types
export const TextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = "1234123"
  return <TaskContent.Provider value={value}>{children}</TaskContent.Provider>
}
