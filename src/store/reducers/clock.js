const initialClockState = {
  isPaused: true,
  // mode: 0,
  // secondsLeft: 1500,
  // secondsRun: 0,
  workNumbers: 0, //workTime
  breakNumbers: 0, //breakTime
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
