import { v4 as uuidv4 } from "uuid"
const initialTaskState = {
  id: "",
  projectID: "",
  title: "",
  description: [
    {
      id: uuidv4(),
      content: "",
      html: {
        parent: "",
        tag: "p",
        name: "",
        style: "",
      },
    },
  ],
  createdDate: new Date().getTime(),
  startDate: new Date().getTime(),
  dueDate: new Date().getTime(),
  clockNumber: 0,
  requiredNumber: -1,
  totalTime: 0,
  location: "",
  parent: "",
  tags: [],
}

function taskReducer(state = initialTaskState, action) {
  switch (action.type) {
    case "task/projectID":
      return {
        ...state,
        projectID: action.payload,
      }
    case "task/setTaskID":
      return {
        ...state,
        id: action.payload,
      }
    case "task/getTaskDetails":
      console.log("old task detail", action.payload)
      return {
        ...state,
        ...action.payload,
      }
    case "task/editDate":
      const { name, date } = action.payload
      return { ...state, [name]: date }
    case "task/description":
      console.log("description", action.payload)
      // if (action.payload.content !== "") {
      //   await firebase.saveDescription(state)
      // }
      return { ...state, description: [...action.payload] }
    case "task/requiredNumber":
      return { ...state, requiredNumber: action.payload }
    case "task/title":
      console.log(action.payload)
      return { ...state, title: action.payload }
    case "setTaskID":
      console.log("taskID", action.payload)
      return { ...state, id: action.payload }
    case "task/location":
      return { ...state, location: action.payload }
    case "task/editTags":
      return { ...state, tags: [...action.payload] }
    case "task/totalTime":
      return { ...state, totalTime: action.payload }
    case "task/clockNumber":
      return { ...state, clockNumber: action.payload }
    case "deleteTag":
      const leftTags = state.tags.filter((tag) => tag.parent !== action.payload)
      return { ...state, tags: [...leftTags] }
    case "createNewTask":
      const newState = {
        ...initialTaskState,
        id: action.payload,
        tags: [],
      }
      return newState
    case "saveTagToProjectTags":
      //when created new Tasks
      const [parentTag, childTag] = action.payload
      const content = {
        parentTag,
        childTag,
        taskID: state.id,
        projectID: state.projectID,
      }

      return state
    default:
      return state
  }
}

export default taskReducer
