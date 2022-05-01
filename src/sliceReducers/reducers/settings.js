const initialSettingsState = {
  base: 15,
  workTime: 4,
  breakTime: 1,
}

function settingsReducer(state = initialSettingsState, action) {
  switch (action.type) {
    case "settings/editTotalTimer":
      const settings = action.payload
      return {
        base: settings.base,
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
