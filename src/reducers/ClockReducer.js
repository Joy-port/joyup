import React, { createContext, useState, useContext } from "react"

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
      console.log(clockType, state[clockType])
      return { ...state, [clockType]: state[clockType]++ }
    default:
      return state
  }
}

export function useClockTimerReducer(
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

const ClockContext = createContext()
export default ClockContext
