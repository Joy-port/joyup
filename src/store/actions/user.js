import { login, firebase } from "../../utils/firebase"
import { tags } from "./tags"

export const user = {
  nativeSignUp: (email, password, userName) => {
    return async (dispatch) => {
      try {
        const userData = await login.userSignUp(email, password, (errorMessage) => {
          dispatch({
            type: "alert/status",
            payload: {
              text: errorMessage,
              type: "danger",
            },
          })
        })
        if (userData.uid) {
          firebase
            .createUserSettingsAndProjectList(userData.uid, userName)
            .then(() => {
              dispatch({ type: "user/getUserID", payload: userData.uid })
              dispatch({ type: "user/getUserName", payload: userData.uid })
            })
            .catch((err) => {
              dispatch({ type: "status/error", payload: err })
            })
        }
      } catch (error) {
        dispatch({ type: "status/error", payload: error })
      }
    }
  },
  nativeLogin: (email, password) => {
    return async (dispatch) => {
      try {
        const loginEmail = email.trim()
        const userData = await login.userSignIn(loginEmail, password, (errorMessage) => {
          console.error(errorMessage)
          dispatch({
            type: "alert/status",
            payload: {
              text: errorMessage,
              type: "danger",
            },
          })
        })
        if (!userData) return
        dispatch({ type: "user/getUserID", payload: userData.uid })
        dispatch(user.getUserProjectList(userData.uid))
      } catch (error) {
        dispatch({ type: "status/error", payload: error })
      }
    }
  },
  login: (userID) => {
    return async (dispatch) => {
      try {
        dispatch({ type: "user/getUserID", payload: userID })
        dispatch(user.getUserProjectList(userID))
      } catch (error) {
        dispatch({ type: "status/error", payload: error })
      }
    }
  },
  logout: () => {
    return async (dispatch) => {
      await login.userSignOut((errorMessage) => {
        dispatch({
          type: "alert/status",
          payload: {
            text: errorMessage,
            type: "danger",
          },
        })
      })
      dispatch({ type: "user/clearUserData" })
      dispatch({ type: "tags/clearTagsData" })
    }
  },
  getUserProjectList: (userID) => {
    return async (dispatch) => {
      await firebase.getUserProjects(userID, (userProjects) => {
        const { ownerProjects, collaborateProjects } = userProjects
        dispatch({ type: "user/getUserOwnProjectList", payload: userProjects })
        dispatch({
          type: "user/getUserProjectList",
          payload: ownerProjects.concat(collaborateProjects),
        })
        dispatch(user.getUserTotalTasks())
        dispatch(tags.initialProjectData())
      })
    }
  },
  getUserTotalTasks: () => {
    return async (dispatch, getState) => {
      try {
        const { totalProjectList } = getState().projects
        const { userProjects } = getState().user
        const newUserTasks = []
        userProjects.forEach((projectID) => {
          const taskList = totalProjectList[projectID].tasks
          newUserTasks.push(...taskList)
        })
        dispatch({ type: "user/getUserTasks", payload: newUserTasks })
      } catch (error) {
        dispatch({ type: "status/error", payload: error })
      }
    }
  },
}
