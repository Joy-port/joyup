import React, { useState, useRef } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Menu from "./components/Menu/index"
import ClockContext from "./components/Clock/ClockContext"
// import TasksContext from "./components/Task/TasksContext"
import SettingsContext, {
  useClockSettingReducer,
} from "./components/Clock/SettingReducer"
import TasksContext, { useTasksReducer } from "./components/Task/TasksReducer"
import TimeSetting from "./pages/TimeSetting"
import Home from "./pages/Home"
import Clock from "./components/Clock"
import Task from "./components/Task"
import Report from "./pages/Report"
import Dashboard from "./pages/Dashboard"
import ChatRoom from "./pages/ChatRoom"

function App() {
  const tasksValue = useTasksReducer()
  const settingValue = useClockSettingReducer()
  const [isPaused, setIsPaused] = useState(true)
  const isPausedRef = useRef(isPaused)
  const [totalSpendingTime, setTotalSpendingTime] = useState(0)

  const clockValue = {
    isPaused,
    setIsPaused,
    isPausedRef,
    totalSpendingTime,
    setTotalSpendingTime,
  }

  //useOutletcontext?
  return (
    <SettingsContext.Provider value={settingValue}>
      <ClockContext.Provider value={clockValue}>
        <TasksContext.Provider value={tasksValue}>
          <Routes>
            <Route path="/" element={<Menu />}>
              <Route index element={<Home />} />
              <Route path="report" element={<Report />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="chatroom" element={<ChatRoom />} />
              <Route path="settings" element={<TimeSetting />} />
              <Route path="task">
                <Route path=":taskID" element={<Task />} />
              </Route>
              <Route path="clock">
                <Route path=":taskID" element={<Clock />} />
              </Route>
              <Route path="task/" element={<Navigate to="/" replace />} />
              <Route path="clock/" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </TasksContext.Provider>
      </ClockContext.Provider>
    </SettingsContext.Provider>
  )
}

export default App
