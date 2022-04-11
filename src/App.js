import React, { useState } from "react"
import { Routes, Route } from "react-router-dom"
import SettingsContext from "./components/SettingContext"
import Clock from "./components/Clock"
import Setting from "./pages/Setting"

function App() {
  const [workMinutes, setWorkMinutes] = useState(2)
  const [breakMinutes, setBreakMinutes] = useState(2)
  const [workNumbers, setWorkNumbers] = useState(0)
  const [breakNumbers, setBreakNumbers] = useState(0)
  const [totalSpendingTime, setTotalSpendingTime] = useState(0)

  return (
    <main>
      <SettingsContext.Provider
        value={{
          workMinutes,
          breakMinutes,
          workNumbers,
          setWorkNumbers,
          breakNumbers,
          setBreakNumbers,
          totalSpendingTime,
          setTotalSpendingTime,
        }}
      >
        <Clock />
      </SettingsContext.Provider>
    </main>
  )
}

export default App
