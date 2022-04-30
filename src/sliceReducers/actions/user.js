import { firebase } from "../../helpers/firebase"

export const user = {
  getUserProjectList: (userID) => {
    return async (dispatch, getData) => {
      const userProjects = await firebase.getUserProjects(userID)
      dispatch({ type: "user/getUserOwnProjectList", payload: userProjects })
      const { ownerProjects, collaborateProjects } = userProjects
      dispatch({
        type: "user/getUserProjectList",
        payload: ownerProjects.concat(collaborateProjects),
      })
    }
  },
}
