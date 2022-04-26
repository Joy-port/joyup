const initialClockState = {
  isPaused: true,
  mode: 0,
  secondsLeft: 0,
  workNumbers: 0,
  breakNumbers: 0,
  startTime: null,
  pauseTime: null,
  stopTime: null,
  totalSpendingSeconds: 0,
  total: 0,
}

function clockReducer(state = initialClockState, action) {
  switch (action.type) {
    case "clockAction":
      const { type, status } = action.payload
      return { ...state, [type]: status }
    case "addClockNumber":
      const { clockType } = action.payload
      return { ...state, [clockType]: state[clockType]++ }
    case "calculateTotalTime":
      console.log(action.payload)
      return { ...state, totalSpendingSeconds: action.payload }
    default:
      return state
  }
}

export default clockReducer
