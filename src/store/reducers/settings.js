const initialSettingsState = {
  workTime: 25,
  breakTime: 5,
}

function settingsReducer(state = initialSettingsState, action) {
  switch (action.type) {
    case "settings/editTotalTimer":
      const settings = action.payload
      return {
        workTime: settings.workTime,
        breakTime: settings.breakTime,
      }
    case "settings/editSingleTimer":
      const { type, duration } = action.payload
      return { ...state, [type]: duration }
    default:
      return state
  }
}

export default settingsReducer
