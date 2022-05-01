import { firebase } from "../../helpers/firebase"

export const settings = {
  getUserSettings: function (userID) {
    return async (dispatch) => {
      try {
        const userSettings = await firebase.getUserSettings(userID)
        if (userSettings) {
          const { clockSettings } = userSettings
          const userProfile = {
            id: userSettings.id,
            userName: userSettings.name,
          }
          dispatch({ type: "settings/initializedSettings", payload: clockSettings })
          dispatch({ type: "user/getUserProfile", payload: userProfile })
        }
      } catch (err) {
        dispatch({ type: "status/ERROR", payload: err })
      }
    }
  },
  editSettingsTimer: function (type, duration) {
    return async (dispatch, getState) => {
      try {
        const newValue = {
          ...getState().settings,
          [type]: duration,
        }
        const { id } = getState().user
        await firebase.editUserSettingsTimer(id, newValue)
        const settingContent = {
          type,
          duration,
        }
        dispatch({ type: "settings/editTimer", payload: settingContent })
      } catch (err) {
        dispatch({ type: "status/ERROR", payload: err })
      }
    }
  },
  //create new user settings
  //add basic task
}
