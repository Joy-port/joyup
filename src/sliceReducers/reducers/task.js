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
  dueDate: new Date(new Date().setHours(new Date().getHours() + 1)).getTime(),
  allDay: false,
  clockNumber: 0,
  requiredNumber: -1,
  totalTime: 0,
  location: "",
  parent: "",
  tagList: [],
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
      return {
        ...state,
        ...action.payload,
      }
    case "task/editDate":
      const { name, date } = action.payload
      return { ...state, [name]: date }
    case "task/description":
      // if (action.payload.content !== "") {
      //   await firebase.saveDescription(state)
      // }
      return { ...state, description: [...action.payload] }
    case "task/requiredNumber":
      return { ...state, requiredNumber: action.payload }
    case "task/title":
      return { ...state, title: action.payload }
    case "setTaskID":
      return { ...state, id: action.payload }
    case "task/location":
      return { ...state, location: action.payload }
    case "task/editTags":
      return { ...state, tagList: [...action.payload] }
    case "task/totalTime":
      return { ...state, totalTime: action.payload }
    case "task/clockNumber":
      return { ...state, clockNumber: action.payload }
    case "deleteTag":
      const leftTags = state.tagList.filter((tag) => tag.parent !== action.payload)
      return { ...state, tagList: [...leftTags] }
    case "createNewTask":
      const newState = {
        ...initialTaskState,
        id: action.payload,
        tagList: [],
      }
      return newState
    case "task/clearTaskWithoutSaving":
      const backToInitialState = {
        ...initialTaskState,
        tagList: [],
      }
      return backToInitialState
    case "task/openSavedTask":
      return { ...state, ...action.payload }
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
