import { login, firebase } from "../../helpers/firebase"

export const user = {
  nativeSignUp: (email, password, userName) => {
    return async (dispatch, getState) => {
      try {
        const signUpEmail = email.trim()
        const userData = await login.userSignUp(signUpEmail, password)
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
        console.log("login")
        const loginEmail = email.trim()
        const userData = await login.userSignIn(loginEmail, password)
        console.log("%c sign in success ", "background: #AC6B7D; color:#ffffff", userData)
        dispatch({ type: "user/getUserID", payload: userData.uid })
      } catch (error) {
        dispatch({ type: "status/ERROR", payload: error })
      }
    }
  },
  logout: () => {
    return async (dispatch, getState) => {
      await login.userSignOut()
    }
  },
  listenUserStatus: () => {
    return async (dispatch, getState) => {
      try {
        const { id } = getState().user
        await login.userStatus(
          async (user) => {
            if (user.id !== id) {
              dispatch({ type: "user/getUserID", payload: user.id })
              const { name } = await firebase.getUserSettings(user.id)
              dispatch({ type: "user/getUserName", payload: name })
            }
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
