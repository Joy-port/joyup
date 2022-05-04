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
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import TimeSetting from "./pages/TimeSetting"
import { useDispatch, useSelector } from "react-redux"
import { settings } from "./sliceReducers/actions/settings"
import { user } from "./sliceReducers/actions/user"
import { project } from "./sliceReducers/actions/project"
import { tags } from "./sliceReducers/actions/tags"

const components = {
  Home,
  Report,
  Dashboard,
  Login,
  TimeSetting,
}

const viewComponents = {
  List,
  Calendar,
  DragFunction,
  Task,
}

function App() {
  // const { id } = useSelector((state) => state.user)
  const id = "VI3mUOQiM2RrYYvNagMuQU4fLgm1"
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
    dispatch(user.listenUserStatus())
  }, [])

  // useEffect(() => {
  //   if (id === "") {
  //     navigate("/login/sign-in")
  //   }
  // }, [id])

  useEffect(() => {
    if (id !== undefined && id !== "" && JSON.stringify(projectList) !== "{}") {
      dispatch(user.getUserProjectList(id)) //change to snapshot
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
        <title>JoyUp | Task Management</title>
      </Helmet>
      {/* {id === undefined ? (
        <Loader></Loader>
      ) : ( */}
      <Routes>
        <Route path="/" element={id !== "" ? <Layout /> : <Outlet />}>
          {/* <Route path="login">
              <Route index element={<Navigate to="sign-in" replace />} />
              <Route path="sign-in" element={<Login pathname="sign-in" />} />
              <Route path="sign-up" element={<Login pathname="sign-up" />} />
            </Route> */}
          <Route index element={<Home />} />
          {pathInfo.map((path, index) => {
            const Component = components[path.component]
            if (path.name !== "Dashboard" || path.name !== "Home") {
              return <Route key={index} path={path.path} element={<Component />} />
            } else {
              return
            }
          })}
          <Route path="dashboard">
            <Route index element={<ProjectList />} />
            <Route path=":projectID" element={<Dashboard />}>
              <Route index element={<Navigate to="list" replace />} />
              {viewInfo.map((view, index) => {
                const Component = viewComponents[view.component]
                let type = view.type || "none"
                return (
                  <Route
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
      {/* )} */}
    </>
  )
}

export default App
