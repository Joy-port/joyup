import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Menu from "./components/Menu/index"
import ClockContext, { useClockTimerReducer } from "./reducers/ClockReducer"
import SettingsContext, { useClockSettingReducer } from "./reducers/SettingReducer"
import TasksContext, { useTasksReducer } from "./reducers/TasksReducer"
import TagsContext, { useTagsReducer } from "./reducers/TagsReducer"
import Clock from "./components/Clock"
import Task from "./components/Task"
import Home from "./pages/Home"
import Report from "./pages/Report"
import Dashboard from "./pages/Dashboard"
import ChatRoom from "./pages/ChatRoom"
import TimeSetting from "./pages/TimeSetting"

function App() {
  const settingValue = useClockSettingReducer()
  const tagsValue = useTagsReducer()
  const clockValue = useClockTimerReducer()
  const tasksValue = useTasksReducer()

  return (
    <SettingsContext.Provider value={settingValue}>
      <TagsContext.Provider value={tagsValue}>
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
      </TagsContext.Provider>
    </SettingsContext.Provider>
  )
}

export default App
