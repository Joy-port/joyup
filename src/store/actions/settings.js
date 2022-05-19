import { firebase } from "../../utils/firebase"

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
          dispatch({ type: "settings/editTotalTimer", payload: clockSettings })
          dispatch({ type: "user/getUserProfile", payload: userProfile })
        }
      } catch (err) {
        dispatch({ type: "status/ERROR", payload: err })
      }
    }
  },
}
