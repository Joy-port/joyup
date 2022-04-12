import React, { useState } from "react"
import { Routes, Route } from "react-router-dom"
import SettingsContext from "./components/SettingContext"
import Clock from "./components/Clock"
import Setting from "./pages/Setting"

function App() {
  const [timerDuration, setTimerDuration] = useState(15)
  const [workMinutes, setWorkMinutes] = useState(4)
  const [breakMinutes, setBreakMinutes] = useState(1)
  const [workNumbers, setWorkNumbers] = useState(0)
  const [breakNumbers, setBreakNumbers] = useState(0)
  const [totalSpendingTime, setTotalSpendingTime] = useState(0)

  return (
    <main>
      <SettingsContext.Provider
        value={{
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
          totalSpendingTime,
          setTotalSpendingTime,
        }}
      >
        <Routes>
          <Route path="/" element={<Clock />} />
          <Route path="settings" element={<Setting />} />
        </Routes>
      </SettingsContext.Provider>
    </main>
  )
}

export default App
