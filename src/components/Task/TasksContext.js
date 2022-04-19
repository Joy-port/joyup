import { any, func, object } from "prop-types"
import React, { createContext, useState, useContext, useReducer } from "react"

const initialTaskState = {
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

function taskReducer(state = initialTaskState, action) {
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
    case "createNewTask":
      return { ...initialTaskState, id: action.payload }
    case "setTitle":
      return { ...state, title: action.payload }
    case "setLocation":
      return { ...state, location: action.payload }
    case "editTags":
      return { ...state, tags: { ...action.payload } }
    default:
      return state
  }
}
// const TasksContext = createContext([])
export const TasksContext = createContext()

// reducer, initialState = {}
export const TasksProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState)
  const value = { state, dispatch }
  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}

TasksProvider.propTypes = {
  // reducer: func,
  // initialState: object,
  children: any,
}

export function useTasksContext() {
  const context = useContext(TasksContext)
  if (context === undefined) {
    throw new Error("useCount must be used within a CountProvider")
  }
  return context
}
// export default TasksContext
