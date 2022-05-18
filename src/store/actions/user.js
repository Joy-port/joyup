import { login, firebase } from "../../utils/firebase"
import { tags } from "./tags"

export const user = {
  nativeSignUp: (email, password, userName) => {
    return async (dispatch, getState) => {
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
            .then(() => {
              console.log(
                "%c sign up success ",
                "background: #AC6B7D; color:#ffffff",
                userData
              )
            })
            .catch((err) => {
              dispatch({ type: "status/ERROR", payload: err })
            })
        }
      } catch (error) {
        dispatch({ type: "status/ERROR", payload: error })
      }
    }
  },
  nativeLogin: (email, password) => {
    return async (dispatch, getState) => {
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
        console.log("%c sign in success ", "background: #AC6B7D; color:#ffffff", userData)
        if (!userData) return
        dispatch({ type: "user/getUserID", payload: userData.uid })
        dispatch(user.getUserProjectList(userData.uid))
      } catch (error) {
        dispatch({ type: "status/ERROR", payload: error })
      }
    }
  },
  logout: () => {
    return async (dispatch, getState) => {
      await login.userSignOut((errorMessage) => {
        console.log(errorMessage)
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
  listenUserStatus: () => {
    return async (dispatch, getState) => {
      try {
        await login.userStatusChange(
          (user) => {
            console.log(
              "%c user is login ",
              "background: #AC6B7D; color:#ffffff",
              user.uid
            )
            dispatch({ type: "user/getUserID", payload: user.uid })
            const { name } = firebase.getUserSettings(user.id)
            dispatch({ type: "user/getUserName", payload: name })
          },
          () => {
            dispatch({ type: "user/clearUserData" })
          }
        )
      } catch (error) {
        dispatch({ type: "status/ERROR", payload: error })
      }
    }
  },
  saveUserName: (name) => {
    return async (dispatch, getState) => {
      try {
        dispatch({ type: "user/getUserName", payload: name })
        const user = getState().user
        const userProfile = {
          id: user.id,
          userName: name,
        }
        await firebase.saveUserSettingsUserName(userProfile)
      } catch (error) {
        dispatch({ type: "status/ERROR", payload: error })
      }
    }
  },
  getUserProjectList: (userID) => {
    return async (dispatch, getData) => {
      await firebase.getUserProjects(userID, (userProjects) => {
        const { ownerProjects, collaborateProjects } = userProjects
        dispatch({ type: "user/getUserOwnProjectList", payload: userProjects })
        dispatch({
          type: "user/getUserProjectList",
          payload: ownerProjects.concat(collaborateProjects),
        })
        console.log("%c listen user project list ", "color:#ee5588;", userProjects)
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
        dispatch({ type: "status/ERROR", payload: error })
      }
    }
  },
}
