import React, { useState, useReducer, useRef } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Menu from "./components/Menu/index"
import SettingsContext from "./components/Clock/SettingContext"
import ClockContext from "./components/Clock/ClockContext"
// import TasksContext from "./components/Task/TasksContext"
import TasksContext from "./components/Task/TasksReducer"
import TimeSetting from "./pages/TimeSetting"
import Home from "./pages/Home"
import Clock from "./components/Clock"
import Task from "./components/Task"
import Report from "./pages/Report"
import Dashboard from "./pages/Dashboard"
import ChatRoom from "./pages/ChatRoom"

const initialTaskState = {
  title: "",
  description: [],
  createdDate: new Date(),
  startDate: new Date(),
  dueDate: new Date(),
  clockNumber: "",
  requiredClockNumber: -1,
  location: "",
  parent: "",
  id: "",
  projectID: "",
  tags: {},
}

export function taskReducer(state, action) {
  switch (action.type) {
    case "editDate":
      const { type, date } = action.payload
      return { ...state, [type]: date }
    case "editDescription":
      return { ...state, description: [...action.payload] }
    case "requiredClock":
      return { ...state, requiredClockNumber: action.payload }
    case "setTaskID":
      return { ...state, id: action.payload }
    case "createNewTask":
      return { ...initialTaskState, id: action.payload }
    case "setTitle":
      return { ...state, title: action.payload }
    case "setLocation":
      return { ...state, location: action.payload }
    case "editTags":
      return { ...state, tags: { ...action.payload } }
    default:
      return state
  }
}

function App() {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState)
  const [isPaused, setIsPaused] = useState(true)
  const isPausedRef = useRef(isPaused)
  const [timerDuration, setTimerDuration] = useState(15)
  const [workMinutes, setWorkMinutes] = useState(4)
  const [breakMinutes, setBreakMinutes] = useState(1)
  const [workNumbers, setWorkNumbers] = useState(0)
  const [breakNumbers, setBreakNumbers] = useState(0)
  const [totalSpendingTime, setTotalSpendingTime] = useState(0)

  const settingsValue = {
    timerDuration,
    setTimerDuration,
    workMinutes,
    setWorkMinutes,
    breakMinutes,
    setBreakMinutes,
    workNumbers,
    setWorkNumbers,
    breakNumbers,
    setBreakNumbers,
  }
  const clockValue = {
    isPaused,
    setIsPaused,
    isPausedRef,
    totalSpendingTime,
    setTotalSpendingTime,
  }

  const tasksValue = [state, dispatch]
  //useOutletcontext?
  return (
    <SettingsContext.Provider value={settingsValue}>
      <ClockContext.Provider value={clockValue}>
        <TasksContext.Provider value={tasksValue}>
          {/* <div className="body"> */}
          {/* <Menu />
            <TaskList /> */}
          {/* <main className="content"> */}
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
          {/* </main> */}
          {/* </div> */}
        </TasksContext.Provider>
      </ClockContext.Provider>
    </SettingsContext.Provider>
  )
}

export default App
