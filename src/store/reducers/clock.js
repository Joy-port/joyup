const initialClockState = {
  isPaused: true,
  workNumbers: 0,
  breakNumbers: 0,
  startTime: null,
  pauseTime: null,
  stopTime: null,
  totalSpendingSeconds: 0,
}

function clockReducer(state = initialClockState, action) {
  switch (action.type) {
    case "clockAction":
      const { type, status } = action.payload
      return { ...state, [type]: status }
    case "clock/addClockNumber":
      const clockType = action.payload
      const addOnce = state[clockType] + 1
      return { ...state, [clockType]: addOnce }
    case "clock/calculateTotalTime":
      return { ...state, totalSpendingSeconds: action.payload }
    default:
      return state
  }
}

export default clockReducer
