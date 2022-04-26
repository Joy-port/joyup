import React, { useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { pathInfo, viewInfo } from "./helpers/config"
import { store } from "./app/store"
import Layout from "./components/Layout"
import TaskProvider from "./reducers/TaskReducer"
import ClockProvider from "./reducers/ClockReducer"
import TagsProvider from "./reducers/TagsReducer"
import Clock from "./components/Clock"
import Task from "./components/Task"
import ProjectList from "./components/View/ProjectList"
import List from "./components/View/List"
import Calendar from "./components/Calendar"
import DragFunction from "./components/DragFunction"
import Home from "./pages/Home"
import Report from "./pages/Report"
import Dashboard from "./pages/Dashboard"
import ChatRoom from "./pages/ChatRoom"
import TimeSetting from "./pages/TimeSetting"
import { useDispatch } from "react-redux"
import { task } from "./sliceReducers/actions/taskAction"

const components = {
  Home,
  Report,
  Dashboard,
  ChatRoom,
  TimeSetting,
}

const viewComponents = {
  List,
  Calendar,
  DragFunction,
  Task,
}

function App() {
  const userID = "dgus0WgwhRr5SOYhTpmi"
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(task.getProjects(userID))
  }, [])
  console.log("store", store.getState())
  return (
    <TagsProvider userID={userID}>
      <TaskProvider>
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
                <Route path=":projectID" element={<ProjectList />} />
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
      </TaskProvider>
    </TagsProvider>
  )
}

export default App
