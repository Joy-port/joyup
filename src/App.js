import React, { useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import SettingsContext from "./components/SettingContext"
import Clock from "./components/Clock"
import setting from "./pages/setting"

function App() {
  const [workMinutes, setWorkMinutes] = useState(45)
  const [breakMinutes, setBreakMinutes] = useState(15)

  return (
    <Router>
      <SettingsContext.Provider
        value={{
          workMinutes,
          setWorkMinutes,
          breakMinutes,
          setBreakMinutes,
        }}
      >
        <Routes>
          <Route path="/" element={Clock} />
          <Route path="settings" element={setting} />
        </Routes>
      </SettingsContext.Provider>
    </Router>
  )
}

export default App
