import React, { useState } from "react"
import { Routes, Route, Navlink } from "react-router-dom"
import Menu from "./components/Menu/index"
import SettingsContext from "./components/Clock/SettingContext"
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
        <Menu />
        <Routes>
          <Route path="/" />
          <Route path="home" />
          <Route path="report" />
          <Route path="dashboard" />
          <Route path="chatroom" />
          <Route path="setting" element={<Setting />} />
        </Routes>
      </SettingsContext.Provider>
    </main>
  )
}

export default App
