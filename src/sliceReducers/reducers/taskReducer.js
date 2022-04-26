export const initialTaskState = {
  title: "",
  description: [],
  createdDate: new Date().getTime(),
  startDate: new Date().getTime(),
  dueDate: new Date().getTime(),
  clockNumber: 0,
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
      const { parent, child, index } = action.payload
      let newTagState = state.tags
      if (state.tags.some((item) => item.parent === parent)) {
        newTagState.find((item) => item.parent === parent).child = child
        newTagState.find((item) => item.parent === parent).index = index
      } else {
        newTagState.push(action.payload)
      }
      console.log(state.tags)
      // firebase.saveTaskPartialContent()
      return { ...state, tags: [...newTagState] }
    case "deleteTag":
      const leftTags = state.tags.filter((tag) => tag.parent !== action.payload)
      return { ...state, tags: [...leftTags] }
    case "saveToDataBase":
      firebase.saveTask(state)
      firebase.saveDescription(state)
      return state
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
      await firebase.saveTagsToProjectIDfromTask(content)

      return state
    case "getTask":
      return state
    case "saveTagsToDB":
      const tagContent = action.payload
      await firebase.saveTaskTags(tagContent)
      return state
    default:
      return state
  }
}

export default taskReducer
