import React, { useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { pathInfo, viewInfo } from "./helpers/config"
import Layout from "./components/Layout"
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
import { useDispatch, useSelector } from "react-redux"
import { settings } from "./sliceReducers/actions/settingsAction"
import { user } from "./sliceReducers/actions/userAction"
import { projects } from "./sliceReducers/actions/projectAction"
import { tags } from "./sliceReducers/actions/tagsAction"

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
  const projectList = useSelector((state) => state.projects)
  const { ownerProjects } = useSelector((state) => state.user)
  useEffect(() => {
    dispatch(projects.updateProjects())
    dispatch(projects.updateTags())
    dispatch(projects.updateTasks())
    dispatch(settings.getUserSettings(userID))
    dispatch(user.getUserProjectList(userID))
  }, [])

  useEffect(() => {
    if (JSON.stringify(projectList) !== "{}" && ownerProjects.length !== 0) {
      dispatch(tags.initialProjectData())
    }
  }, [projectList, ownerProjects])

  return (
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
        <Route path="dashboard">
          <Route index element={<ProjectList />} />
          <Route path=":projectID" element={<Dashboard />}>
            {viewInfo.map((view, index) => {
              const Component = viewComponents[view.component]
              let type = view.type || "none"
              const isHome = view.path === "list"
              return (
                <Route
                  index={isHome}
                  path={view.path}
                  key={index}
                  element={<Component type={type} />}
                ></Route>
              )
            })}
          </Route>
        </Route>
        <Route path="task">
          <Route index element={<Navigate to="/" replace />} />
          <Route path=":taskID" element={<Task />} />
        </Route>
        <Route path="clock">
          <Route index element={<Navigate to="/" replace />} />
          <Route path=":taskID" element={<Clock />} />
        </Route>

        {viewInfo.map((view) => (
          <Route
            path={`${view.path}/`}
            key={view.path}
            element={<Navigate to="/" replace />}
          />
        ))}
      </Route>
    </Routes>
  )
}

export default App
