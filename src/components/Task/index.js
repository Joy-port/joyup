import React, { useContext, useEffect, useState } from "react"
import SettingContext from "../Clock/SettingContext"
import ClockContext from "../Clock/ClockContext"
import AddSubtask from "./AddSubtask"
import SettingEditor from "./SettingEditor"
import TextEditor from "./TextEditor"
// import { TaskContent, TextProvider, useTaskContext } from "./TasksReducer"
import DatePicker from "./DatePicker"
import TasksContent from "./TasksReducer"

const index = () => {
  // const value = useTaskContext()
  const [state, dispatch] = useContext(TasksContent)
  const { timerDuration, workMinutes, breakMinutes, workNumbers } =
    useContext(SettingContext)
  const { isPaused, setIsPaused, isPausedRef, totalSpendingTime, setTotalSpendingTime } =
    useContext(ClockContext)
  const [dueDate, setDueDate] = useState(new Date())
  const [startDate, setStartDate] = useState(new Date())
  useEffect(() => {
    if (dueDate < startDate) {
      setDueDate(() => {
        const afterStartDate = startDate
        return afterStartDate
      })
    }
  }, [startDate, setStartDate])
  useEffect(() => {
    dispatch({ type: "editDate", payload: { type: "startDate", date: startDate } })
  }, [startDate])
  useEffect(() => {
    dispatch({ type: "editDate", payload: { type: "dueDate", date: dueDate } })
  }, [dueDate])
  return (
    <>
      <button className="fixed bottom-5 right-5 text-lg bg-slateDark text-white rounded py-2 px-4">
        open task
      </button>
      <div className="task-container">
        <div className="flex flex-col gap-3 w-3/4">
          <SettingEditor />
          <TextEditor description={state.description} />
          <AddSubtask>AddSubtask</AddSubtask>
        </div>
        <div className="flex flex-col gap-3">
          <p>
            Created date: <br />
            {new Date().toLocaleString()}
          </p>
          <div>Start Date</div>
          <DatePicker date={startDate} setDate={setStartDate} />
          <div>Due Date</div>
          <DatePicker date={dueDate} setDate={setDueDate} />
          <p>Start Clock</p>
          <button
            onClick={() => {
              isPausedRef.current = false
              setIsPaused(false)
            }}
          >
            +
          </button>
          <p>Pause</p>
          <button
            onClick={() => {
              isPausedRef.current = true
              setIsPaused(true)
            }}
          >
            -
          </button>
          <p>Total Time Spent</p>
          <p>{totalSpendingTime}</p>
          <p>Already had Tomatos: {workNumbers}</p>
          <select
            name="number"
            value={state.requiredClockNumber}
            id=""
            onChange={(e) => {
              dispatch({ type: "requiredClock", payload: e.target.value })
            }}
          >
            <option value="none" disabled>
              Select needed Tomato
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <button className="bg-slateDark text-white px-2 py-1 rounded">save</button>
        </div>
      </div>
    </>
  )
}

export default index
