const initialProjectState = {
  projectList: [],
  totalTaskList: {},
  totalTagList: {},
  totalProjectList: {},
  templateList: [],
}

function projectReducer(state = initialProjectState, action) {
  switch (action.type) {
    case "projects/updateProjects":
      // const projectDetail = { ...action.payload }
      // const projectListWithTask = {}
      // const projectIDs = Object.keys(action.payload)
      // const userProjectList = projectIDs.map((id) => {
      //   projectListWithTask = {
      //     ...projectDetail[id][tasks],
      //   }
      // })

      return {
        ...state,
        totalProjectList: { ...action.payload },
        projectList: Object.keys(action.payload),
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
    case "projects/updateTemplate":
      return {
        ...state,
        templateList: [...action.payload],
      }
    default:
      return state
  }
}

export default projectReducer
