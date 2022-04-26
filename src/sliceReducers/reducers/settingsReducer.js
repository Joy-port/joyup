const initialSettingsState = {
  timerDuration: 15,
  workMinutes: 4,
  breakMinutes: 1,
}

function settingsReducer(state = initialSettingsState, action) {
  switch (action.type) {
    case "editTimer":
      const { type, duration } = action.payload
      return { ...state, [type]: duration }
    default:
      return state
  }
}

export default settingsReducer
