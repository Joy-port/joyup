const initialUserState = {
  userProjects: [],
  collaborateProjects: [],
  ownerProjects: [],
  invitationProjects: [],
  userName: "",
  id: "",
}

function userReducer(state = initialUserState, action) {
  switch (action.type) {
    case "user/getUserProjectList":
      return { ...state, userProjects: [...action.payload] }
    case "user/getUserOwnProjectList":
      const { ownerProjects, collaborateProjects } = action.payload
      return {
        ...state,
        ownerProjects: [...ownerProjects],
        collaborateProjects: [...collaborateProjects],
      }
    case "user/receiveInvitationProjectList":
      return {
        ...state,
        invitationProjects: [...action.payload],
      }
    case "user/getUserProfile":
      const { id, userName } = action.payload
      return {
        ...state,
        userName,
        id,
      }
    default:
      return state
  }
}

export default userReducer
