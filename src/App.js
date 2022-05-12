import React, { useEffect, useState } from "react"
import { Routes, Route, Navigate, useNavigate, Outlet } from "react-router-dom"
import { Helmet } from "react-helmet"
import { pathInfo, viewInfo } from "./helpers/config"
import Loader from "./components/Loader"
import Layout from "./components/Layout"
import Clock from "./components/Clock"
import Task from "./components/Task"
import ProjectList from "./components/View/ProjectList"
import List from "./components/View/List"
import Calendar from "./components/Calendar"
import DragFunction from "./components/DragFunction"
import Home from "./pages/Home"
import Report from "./pages/Report"
import Projects from "./pages/Projects"
import Login from "./pages/Login"
import Settings from "./pages/Settings"
import { useDispatch, useSelector } from "react-redux"
import { settings } from "./sliceReducers/actions/settings"
import { user } from "./sliceReducers/actions/user"
import { project } from "./sliceReducers/actions/project"
import { tags } from "./sliceReducers/actions/tags"

const components = {
  Home,
  Report,
  Projects,
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
  const { id } = useSelector((state) => state.user)
  // const id = "VI3mUOQiM2RrYYvNagMuQU4fLgm1"
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const projectList = useSelector((state) => state.projects)
  const { totalProjectList } = useSelector((state) => state.projects)
  const { selectedProjectID } = useSelector((state) => state.tags)
  const { ownerProjects } = useSelector((state) => state.user)
  // console.log("%c user ID ", "background: #ffcc88; color:white", id)

  useEffect(() => {
    dispatch(project.updateProjects())
    dispatch(project.updateTags())
    dispatch(project.updateTasks())
    // dispatch(user.listenUserStatus())
  }, [])

  // useEffect(() => {
  //   if (id === "") {
  //     navigate("/login/sign-in")
  //   }
  // }, [id])
  useEffect(() => {
    if (id !== undefined && id !== "" && JSON.stringify(projectList) !== "{}") {
      dispatch(user.getUserProjectList(id))
    }
  }, [id])
  useEffect(() => {
    if (id !== undefined && id !== "" && JSON.stringify(projectList) !== "{}") {
      // dispatch(user.getUserProjectList(id))
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
  console.log(id)
  return (
    <>
      <Helmet>
        <title>JoyUp | Task Management</title>
      </Helmet>
      {typeof id === "undefined" ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          {id === "" ? (
            <Routes>
              <Route index element={<Navigate to="/signin" replace />}></Route>
              <Route path="signin" element={<Login />} />
              <Route path="signup" element={<Login />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route element={<Home />}>
                  <Route index element={<Navigate to="/calendar" replace />} />
                  <Route path="calendar" element={<Home />} />
                  <Route path="agenda" element={<Home />} />
                </Route>
                <Route path="reports" element={<Report />} />
                <Route path="projects">
                  <Route index element={<ProjectList />} />
                  <Route path=":projectID" element={<Projects />}>
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
                {/* {viewInfo.map((view) => (
            <Route
              path={`${view.path}/`}
              key={view.path}
              element={<Navigate to="/" replace />}
            />
          ))} */}
              </Route>
            </Routes>
          )}
        </>
      )}
    </>
  )
}

export default App
