import React, { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import SettingContext from "../Clock/SettingContext"
import ClockContext from "../Clock/ClockContext"
import AddSubtask from "./AddSubtask"
import SettingEditor from "./SettingEditor"
import TextEditor from "./TextEditor"
// import { TaskContent, TextProvider, useTaskContext } from "./TasksReducer"
import DatePicker from "./DatePicker"
import TasksContent from "./TasksReducer"
import dayjs from "dayjs"

const total = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const index = () => {
  // const value = useTaskContext()
  const [state, dispatch] = useContext(TasksContent)
  const { taskID } = useParams()
  const { workNumbers } = useContext(SettingContext)
  const { totalSpendingTime } = useContext(ClockContext)
  const [dueDate, setDueDate] = useState(new Date())
  const [startDate, setStartDate] = useState(new Date())
  useEffect(() => {
    dispatch({ type: "setTaskID", payload: taskID })
  }, [taskID])
  useEffect(() => {
    if (dueDate < startDate) {
      setDueDate(() => {
        const afterStartDate = startDate
        return afterStartDate
      })
    }
  }, [startDate, setStartDate])
  useEffect(() => {
    const date = new Date(startDate).getTime()
    dispatch({ type: "editDate", payload: { type: "startDate", date: date } })
  }, [startDate])
  useEffect(() => {
    const date = new Date(startDate).getTime()
    dispatch({ type: "editDate", payload: { type: "dueDate", date: date } })
  }, [dueDate])
  return (
    <>
      <div className="task-container">
        <div className="flex flex-col gap-3 w-3/4">
          <SettingEditor setStartDate={setStartDate} setDueDate={setDueDate} />
          <TextEditor description={state.description} />
          <AddSubtask>AddSubtask</AddSubtask>
        </div>
        <div className="flex flex-col gap-3">
          <p>
            Created date: <br />
            {new Date().toLocaleString()}
          </p>
          <div>Start Date</div>
          <p>{dayjs(new Date(state.startDate).getTime()).format("MM/DD HH:mm ")}</p>
          <DatePicker date={startDate} setDate={setStartDate} showType={false} />
          <div>Due Date</div>
          <p>{dayjs(new Date(state.dueDate).getTime()).format("MM/DD HH:mm ")}</p>
          <DatePicker date={dueDate} setDate={setDueDate} showType={false} />
          <Link to={`/clock/${taskID}`} className="bg-orange text-white">
            OpenClock
          </Link>
          <p>Total Time Spent</p>
          <p>{totalSpendingTime}</p>
          <p>Already had Tomatos: {workNumbers}</p>
          <select
            name="number"
            value={state.requiredClockNumber}
            onChange={(e) => {
              dispatch({ type: "requiredClock", payload: e.target.value })
            }}
          >
            <option value={-1} disabled>
              Select needed Tomato
            </option>
            {total.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <button className="bg-slateDark text-white px-2 py-1 rounded">save</button>
        </div>
      </div>
    </>
  )
}

export default index
