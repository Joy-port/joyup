import React, { useState, createContext } from "react"

export const initialTimeState = {
  timerDuration: 15,
  workMinutes: 4,
  breakMinutes: 1,
  workNumbers: 0,
  breakNumbers: 0,
}

export function timeReducer(state, action) {
  switch (action.type) {
    case "editTimer":
      const { type, duration } = action.payload
      return { ...state, [type]: duration }
    case "addClockNumber":
      const { clockType } = action.payload
      return { ...state, [clockType]: state[clockType] + 1 }
    default:
      return state
  }
}

export function useClockSettingReducer(
  reducer = timeReducer,
  initialState = initialTimeState
) {
  const [state, setState] = useState(initialState)

  function dispatch(action) {
    const nextState = reducer(state, action)
    setState(nextState)
  }

  return [state, dispatch]
}

const SettingsContext = createContext()
// export function useClockSettingReducer(reducer = timeReducer, initialTimeState) {
//   const [state, setState] = useState(initialTimeState)

//   function dispatch(action) {
//     const nextState = reducer(state, action)
//     setState(nextState)
//   }

//   return [state, dispatch]
// }
export default SettingsContext
