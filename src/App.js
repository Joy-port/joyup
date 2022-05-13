import React, { useContext, useEffect, useState } from "react"
import { Routes, Route, Navigate, useNavigate, Outlet } from "react-router-dom"
import { Helmet } from "react-helmet"
import { pathInfo, viewInfo } from "./helpers/config"
import Layout from "./components/Layout"
import Clock from "./components/Clock"
import Task from "./components/Task"
import ProjectList from "./pages/ProjectList"
import List from "./components/View/List"
import Calendar from "./components/Calendar"
import DragFunction from "./components/DragFunction"
import Home from "./pages/Home"
import Report from "./pages/Report"
import ProjectViews from "./components/View/ProjectViews"
import Login from "./pages/Login"
import Settings from "./pages/Settings"
import { useDispatch, useSelector } from "react-redux"
import { settings } from "./sliceReducers/actions/settings"
import { user } from "./sliceReducers/actions/user"
import { project } from "./sliceReducers/actions/project"
import { tags } from "./sliceReducers/actions/tags"
import AuthProvider, { AuthContext } from "./components/AuthProvider"

const components = {
  Home,
  Report,
  ProjectViews,
  Login,
  Settings,
}

const viewComponents = {
  List,
  Calendar,
  DragFunction,
  Task,
}

function App() {
  // const [userDetail, loading, error] = useContext(AuthContext)
  const { id } = useSelector((state) => state.user)
  // const id = "VI3mUOQiM2RrYYvNagMuQU4fLgm1"
  const dispatch = useDispatch()
  const projectList = useSelector((state) => state.projects)
  const { totalProjectList } = useSelector((state) => state.projects)
  const { selectedProjectID } = useSelector((state) => state.tags)
  const { ownerProjects } = useSelector((state) => state.user)
  console.log("%c user ID ", "background: #ffcc88; color:white", id)

  useEffect(() => {
    dispatch(project.updateProjects())
    dispatch(project.updateTags())
    dispatch(project.updateTasks())
    dispatch(user.listenUserStatus())
  }, [])

  useEffect(() => {
    if (id !== undefined && id !== "" && JSON.stringify(projectList) !== "{}") {
      dispatch(user.getUserProjectList(id))
    }
  }, [id])
  useEffect(() => {
    if (id !== undefined && id !== "" && JSON.stringify(projectList) !== "{}") {
      dispatch(user.getUserProjectList(id))
      dispatch(settings.getUserSettings(id))
    }
  }, [id, projectList, totalProjectList])

  useEffect(() => {
    if (JSON.stringify(projectList) !== "{}" && ownerProjects.length !== 0) {
      if (selectedProjectID === "") {
        dispatch(tags.initialProjectData())
      } else {
        dispatch(tags.switchProject(selectedProjectID))
      }
    }
  }, [projectList, ownerProjects])
  return (
    <>
      <Helmet>
        <title>JoyUp | Personal Tasks Management</title>
      </Helmet>
      <AuthProvider>
        <Routes>
          <Route path="/">
            <Route path="signin" element={<Login />} />
            <Route
              path="signup"
              element={
                <AuthProvider>
                  <Login />
                </AuthProvider>
              }
            />
            <Route
              element={
                <Layout>
                  <Outlet />
                </Layout>
              }
            >
              <Route index element={<Navigate to="/calendar" replace />} />
              <Route path="calendar" element={<Home />} />
              <Route path="agenda" element={<Home />} />
              <Route path="reports" element={<Report />} />
              <Route path="projects">
                <Route index element={<ProjectList />} />
                <Route path=":projectID" element={<ProjectViews />}>
                  <Route index element={<Navigate to="list" replace />} />
                  {viewInfo.map((view, index) => {
                    const Component = viewComponents[view.component]
                    let type = view.type || "none"
                    const calendarParams = view.name === "Calendar"
                    return (
                      <Route
                        path={`${view.path}${calendarParams ? "/:calendarView" : ""}`}
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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App
