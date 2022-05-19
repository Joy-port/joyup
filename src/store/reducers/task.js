import { v4 as uuidv4 } from "uuid"
const initialTaskState = {
  id: "",
  projectID: "",
  title: "",
  description: [
    {
      id: uuidv4(),
      content: "Description",
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
  mode: 0,
  secondsLeft: 1500,
  secondsRun: 0,
  totalTime: 0,
  breakTime: 5,
  workTime: 25,
  clockNumber: 0, //workTime
  requiredTime: 0,
  requiredNumber: 0, //totalRequired clock number
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
      return { ...state, description: [...action.payload] }
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
    case "task/mode":
      return { ...state, mode: action.payload }
    case "task/secondsLeft":
      return { ...state, secondsLeft: action.payload }
    case "task/secondsRun":
      return { ...state, secondsRun: action.payload }
    case "task/requiredNumber":
      if (action.payload < 0) return state
      const newRequiredTime = parseFloat(action.payload * state.workTime)
      return { ...state, requiredNumber: action.payload, requiredTime: newRequiredTime }
    case "task/breakTime":
      if (action.payload < 0) return state
      return { ...state, breakTime: action.payload }
    case "task/requiredTime":
      if (action.payload < 0) return state
      const newClockNumber = Math.round(
        action.payload / (state.workTime + state.breakTime)
      )
      return { ...state, requiredTime: action.payload, requiredNumber: newClockNumber }
    case "task/workTime":
      if (action.payload < 0) return state
      let newRequiredNumber = 0
      if (state.requiredTime !== 0) {
        newRequiredNumber = Math.round(state.requiredTime / action.payload)
      }
      return { ...state, workTime: action.payload, requiredNumber: newRequiredNumber }
    case "task/clockNumber":
      if (action.payload < 0) return state
      return { ...state, clockNumber: action.payload }
    case "deleteTag":
      const leftTags = state.tagList.filter((tag) => tag.parent !== action.payload)
      return { ...state, tagList: [...leftTags] }
    case "task/createNewTask":
      const newState = {
        ...initialTaskState,
        id: action.payload,
        tagList: [],
        description: [
          {
            id: uuidv4(),
            content: "Description",
            html: {
              parent: "",
              tag: "p",
              name: "",
              style: "",
            },
          },
        ],
      }
      return newState
    case "task/clearTaskWithoutSaving":
      const backToInitialState = {
        ...initialTaskState,
        tagList: [],
        description: [
          {
            id: uuidv4(),
            content: "Description",
            html: {
              parent: "",
              tag: "p",
              name: "",
              style: "",
            },
          },
        ],
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
