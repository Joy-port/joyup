import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { pathInfo, viewInfo } from "./helpers/config"
import Layout from "./components/Layout"
import SettingsProvider from "./reducers/SettingReducer"
import ProjectProvider from "./reducers/ProjectReducer"
import TaskProvider from "./reducers/TaskReducer"
import ClockProvider from "./reducers/ClockReducer"
import TagsProvider from "./reducers/TagsReducer"
import Clock from "./components/Clock"
import Task from "./components/Task"
import List from "./components/View/List"
import DragFunction from "./components/DragFunction"
import Home from "./pages/Home"
import Report from "./pages/Report"
import Dashboard from "./pages/Dashboard"
import ChatRoom from "./pages/ChatRoom"
import TimeSetting from "./pages/TimeSetting"

const components = {
  Home,
  Report,
  Dashboard,
  ChatRoom,
  TimeSetting,
}

const viewComponents = {
  List,
  DragFunction,
  Task,
}

function App() {
  const userID = "dgus0WgwhRr5SOYhTpmi"
  return (
    <ProjectProvider userID={userID}>
      <SettingsProvider>
        <TaskProvider>
          <TagsProvider>
            <ClockProvider>
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
                      const Component = viewComponents[view.component]
                      let type = view.type || "none"
                      const isHome = view.path === "list"
                      return (
                        <Route path={view.path} key={index}>
                          <Route
                            index={isHome}
                            path=":projectID"
                            element={<Component type={type} />}
                          />
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
            </ClockProvider>
          </TagsProvider>
        </TaskProvider>
      </SettingsProvider>
    </ProjectProvider>
  )
}

export default App
