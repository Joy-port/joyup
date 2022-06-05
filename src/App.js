import { useEffect } from "react"
import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import { useDispatch } from "react-redux"
import { project } from "./store/actions/project"
import ProjectList from "./pages/ProjectList"
import Home from "./pages/Home"
import Report from "./pages/Report"
import Login from "./pages/Login"
import Layout from "./components/Layout"
import Clock from "./components/Clock"
import Task from "./components/Task"
import List from "./components/View/List"
import Calendar from "./components/Calendar"
import DragFunction from "./components/DragFunction"
import ProjectViews from "./components/View/ProjectViews"
import AuthProvider from "./components/AuthProvider"
import IntroductionTour from "./components/IntroTour"
import Alert from "./components/Alert"
import Confirm from "./components/Confirm"
import { viewInfo } from "./utils/config"

const viewComponents = {
  List,
  Calendar,
  DragFunction,
  Task,
}

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(project.updateProjects())
    dispatch(project.updateTags())
    dispatch(project.updateTasks())
  }, [])

  return (
    <AuthProvider>
      <Confirm />
      <Alert />
      <IntroductionTour />
      <Routes>
        <Route path="/">
          <Route path="signin" element={<Login />} />
          <Route path="signup" element={<Login />} />
          <Route
            element={
              <Layout>
                <Outlet />
              </Layout>
            }
          >
            <Route index element={<Navigate to="/calendar" replace />} />
            <Route path="calendar" element={<Home />}>
              <Route path=":calendarView" element={<Home />} />
            </Route>
            <Route path="agenda" element={<Home />} />
            <Route path="reports" element={<Report />} />
            <Route path="projects">
              <Route index element={<ProjectList />} />
              <Route path=":projectID" element={<ProjectViews />}>
                <Route path="*" element={<Navigate to="/" replace />} />
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
                    />
                  )
                })}
              </Route>
            </Route>
            <Route path="tasks">
              <Route index element={<Navigate to="/" replace />} />
              <Route path=":taskID" element={<Task />} />
            </Route>
            <Route path="clocks">
              <Route index element={<Navigate to="/" replace />} />
              <Route path=":taskID" element={<Clock />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
