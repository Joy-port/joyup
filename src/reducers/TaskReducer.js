import { any } from "prop-types"
import React, { createContext } from "react"
import { firebase } from "../helpers/firebase"
import { useAsyncReducer } from "../helpers/useAsyncReducer"

export const initialTaskState = {
  title: "",
  description: [],
  createdDate: new Date().getTime(),
  startDate: new Date().getTime(),
  dueDate: new Date().getTime(),
  clockNumber: "",
  requiredNumber: -1,
  location: "",
  parent: "",
  id: "",
  projectID: "8gx8UcCs8cLC8V8s2SMK",
  tags: [],
  totalTime: "",
}

async function taskReducer(state = initialTaskState, action) {
  switch (action.type) {
    case "editDate":
      const { name, date } = action.payload
      const { createdDate, dueDate } = state
      if (createdDate !== dueDate) {
        firebase.saveTaskPartialContent(state.id, { [name]: date })
      }
      return { ...state, [name]: date }
    case "editDescription":
      console.log("description", action.payload)
      if (action.payload.content !== "") {
        await firebase.saveDescription(state)
      }
      return { ...state, description: [...action.payload] }
    case "requiredClock":
      console.log("required clock", action.payload)
      firebase.saveTaskPartialContent(state.id, { requiredNumber: action.payload })
      return { ...state, requiredNumber: action.payload }
    case "setTaskID":
      console.log("taskID", action.payload)
      return { ...state, id: action.payload }
    case "setTitle":
      if (action.payload === "") return state
      console.log("title", action.payload)
      firebase.saveTaskPartialContent(state.id, { title: action.payload })
      return { ...state, title: action.payload }
    case "setLocation":
      console.log("location", action.payload)
      return { ...state, location: action.payload }
    case "editTags":
      const { parent, child } = action.payload
      let newState = state.tags
      if (state.tags.some((item) => item.parent === parent)) {
        newState.find((item) => item.parent === parent).child = child
      } else {
        newState.push(action.payload)
      }
      console.log("tags", newState)
      return { ...state, tags: [...newState] }
    case "saveToDataBase":
      firebase.saveTask(state)
      firebase.saveDescription(state)
      return state
    case "createNewTask":
      console.log("create new")
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
