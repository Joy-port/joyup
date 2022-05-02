import { any } from "prop-types"
import React, { createContext, useReducer } from "react"

export const initialTimeState = {
  isPaused: true,
  mode: 0,
  secondsLeft: 0,
  workNumbers: 0,
  breakNumbers: 0,
  startTime: null,
  pauseTime: null,
  stopTime: null,
}

export function timeReducer(state = initialTimeState, action) {
  switch (action.type) {
    case "clockAction":
      const { type, status } = action.payload
      return { ...state, [type]: status }
    case "addClockNumber":
      const { clockType } = action.payload
      return { ...state, [clockType]: state[clockType]++ }
    default:
      return state
  }
}

// export function useClockTimerReducer(
//   reducer = timeReducer,
//   initialState = initialTimeState
// ) {
//   const [state, setState] = useState(initialState)

//   function dispatch(action) {
//     const nextState = reducer(state, action)
//     setState(nextState)
//   }

//   return [state, dispatch]
// }

export const ClockContext = createContext()
const ClockProvider = ({ children }) => {
  const value = useReducer(timeReducer, initialTimeState)
  return <ClockContext.Provider value={value}>{children}</ClockContext.Provider>
}

ClockProvider.propTypes = {
  children: any,
}

export default ClockProvider
