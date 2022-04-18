import React, { createContext, useState, useContext } from "react"

const SettingContext = createContext({})

export const useClockSettings = () => useContext(SettingProvider)

// eslint-disable-next-line react/prop-types
const SettingProvider = ({ children }) => {
  const [timerDuration, setTimerDuration] = useState(15)
  const [workMinutes, setWorkMinutes] = useState(4)
  const [breakMinutes, setBreakMinutes] = useState(1)
  const [workNumbers, setWorkNumbers] = useState(0)
  const [breakNumbers, setBreakNumbers] = useState(0)
  // const [totalSpendingTime, setTotalSpendingTime] = useState(0)

  const value = {
    timerDuration,
    setTimerDuration,
    workMinutes,
    setWorkMinutes,
    breakMinutes,
    setBreakMinutes,
    workNumbers,
    setWorkNumbers,
    breakNumbers,
    setBreakNumbers,
    // totalSpendingTime,
    // setTotalSpendingTime,
  }

  return <SettingContext.Provider value={value}>{children}</SettingContext.Provider>
}

export default SettingContext
