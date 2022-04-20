import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout"
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
import { pathInfo, viewInfo } from "./helpers/config"

const components = {
  Home,
  Report,
  Dashboard,
  ChatRoom,
  TimeSetting,
}

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
              <Route path="/" element={<Layout />}>
                {pathInfo.map((path, index) => {
                  const Component = components[path.component]
                  const isHome = path.path === "/"
                  if (path.name !== "Dashboard") {
                    return (
                      <Route
                        key={index}
                        index={isHome}
                        path={path.path}
                        element={<Component />}
                      />
                    )
                  } else {
                    return
                  }
                })}
                <Route path="dashboard" element={<Dashboard />}>
                  {viewInfo.map((view, index) => {
                    const Component = components[view.component]
                    return (
                      <Route path={`dashboard/{view.path}`} key={index}>
                        <Route path=":projectID" element={<Component />} />
                      </Route>
                    )
                  })}
                </Route>
                <Route path="task">
                  <Route path=":taskID" element={<Task />} />
                </Route>
                <Route path="clock">
                  <Route path=":taskID" element={<Clock />} />
                </Route>
                <Route path="task/" element={<Navigate to="/" replace />} />
                <Route path="clock/" element={<Navigate to="/" replace />} />
                {viewInfo.map((view) => (
                  <Route
                    path={`${view.path}/`}
                    key={view.path}
                    element={<Navigate to="/" replace />}
                  />
                ))}
              </Route>
            </Routes>
          </TasksContext.Provider>
        </ClockContext.Provider>
      </TagsContext.Provider>
    </SettingsContext.Provider>
  )
}

export default App
