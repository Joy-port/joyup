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
    case "getUserProjectList":
      return { ...state, userProjects: [...action.payload] }
    case "getUserOwnProjectList":
      const [ownProjects, collaborateProjects] = action.payload
      return {
        ...state,
        ownerProjects: [...ownProjects],
        collaborateProjects: [...collaborateProjects],
      }
    case "receiveInvitationProjectList":
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
