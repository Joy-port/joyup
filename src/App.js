import React, { useState } from "react"
import { Routes, Route } from "react-router-dom"
import Menu from "./components/Menu/index"
import SettingsContext from "./components/Clock/SettingContext"
import Setting from "./pages/Setting"
import Task from "./components/Task"

function App() {
  const [timerDuration, setTimerDuration] = useState(15)
  const [workMinutes, setWorkMinutes] = useState(4)
  const [breakMinutes, setBreakMinutes] = useState(1)
  const [workNumbers, setWorkNumbers] = useState(0)
  const [breakNumbers, setBreakNumbers] = useState(0)
  const [totalSpendingTime, setTotalSpendingTime] = useState(0)

  return (
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
      <div className="body">
        <Menu />
        <Task />
        <main className="content">
          <Routes>
            <Route path="/" />
            <Route path="home" />
            <Route path="report" />
            <Route path="dashboard" />
            <Route path="chatroom" />
            <Route path="setting" element={<Setting />} />
          </Routes>
        </main>
      </div>
    </SettingsContext.Provider>
  )
}

export default App
