import React, { createContext } from "react"
import { useAsyncReducer } from "../helpers/useAsyncReducer"
import { any } from "prop-types"

export const initialTimeState = {
  timerDuration: 15,
  workMinutes: 4,
  breakMinutes: 1,
}

export async function timeReducer(state, action) {
  switch (action.type) {
    case "editTimer":
      const { type, duration } = action.payload
      return { ...state, [type]: duration }
    default:
      return state
  }
}

// export function useClockSettingReducer(
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

export const SettingsContext = createContext()

const SettingsProvider = ({ children }) => {
  const value = useAsyncReducer(timeReducer, initialTimeState)
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

SettingsProvider.propTypes = {
  children: any,
}

export default SettingsProvider
