const initialProjectState = {
  totalTaskList: {},
  totalTagList: {},
  totalProjectList: {},
}

function projectReducer(state = initialProjectState, action) {
  switch (action.type) {
    case "projects/updateProjects":
      return {
        ...state,
        totalProjectList: { ...action.payload },
      }
    case "projects/updateTagsDetail":
      return {
        ...state,
        totalTagList: { ...action.payload },
      }
    case "projects/updateAllTasks":
      return {
        ...state,
        totalTaskList: { ...action.payload },
      }
    default:
      return state
  }
}

export default projectReducer
