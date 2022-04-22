import { any } from "prop-types"
import React, { createContext, useReducer } from "react"
import { useAsyncReducer } from "../helpers/useAsyncReducer"

export const initialTaskState = {
  title: "",
  description: [],
  createdDate: new Date().getTime(),
  startDate: new Date().getTime(),
  dueDate: "",
  clockNumber: "",
  requiredClockNumber: -1,
  location: "",
  parent: "",
  id: "",
  projectID: "",
  tags: [],
}

export async function taskReducer(state = initialTaskState, action) {
  switch (action.type) {
    case "editDate":
      const { name, date } = action.payload
      return { ...state, [name]: date }
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
      const { parent, child } = action.payload
      let newState = state.tags
      if (state.tags.some((item) => item.parent === parent)) {
        newState.find((item) => item.parent === parent).child = child
      } else {
        newState.push(action.payload)
      }
      console.log(newState)
      return { ...state, tags: [...newState] }
    case "createNewTask":
      return { ...initialTaskState, id: action.payload }
    default:
      return state
  }
}

export const TaskContext = createContext()

const TaskProvider = ({ children }) => {
  const value = useAsyncReducer(taskReducer, initialTaskState)
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

TaskProvider.propTypes = {
  children: any,
}

export default TaskProvider
