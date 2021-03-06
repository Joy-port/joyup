const initialUserState = {
  userProjects: [],
  collaborateProjects: [],
  ownerProjects: [],
  userTasks: [],
  userName: "",
  id: "",
  isFirstTimeUser: false,
}

function userReducer(state = initialUserState, action) {
  switch (action.type) {
    case "user/getUserID":
      return { ...state, id: action.payload }
    case "user/getUserName":
      return { ...state, userName: action.payload }
    case "user/clearUserData":
      const clearUserData = { ...initialUserState }
      return clearUserData
    case "user/getUserProjectList":
      return { ...state, userProjects: [...action.payload] }
    case "user/getUserOwnProjectList":
      const { ownerProjects, collaborateProjects } = action.payload
      return {
        ...state,
        ownerProjects: [...ownerProjects],
        collaborateProjects: [...collaborateProjects],
      }
    case "user/getUserProfile":
      const { id, userName } = action.payload
      return {
        ...state,
        userName,
        id,
      }
    case "user/getUserTasks":
      return {
        ...state,
        userTasks: [...action.payload],
      }
    case "user/setIsFirstTimeUser":
      return {
        ...state,
        isFirstTimeUser: action.payload,
      }
    case "user/setTourStage":
      return {
        ...state,
        tourStage: action.payload,
      }
    default:
      return state
  }
}

export default userReducer
