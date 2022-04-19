import React, { useContext, useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
// import SettingContext from "../Clock/SettingContext"
import { useClockSettingReducer } from "../Clock/SettingReducer"
import ClockContext from "../Clock/ClockContext"
import AddSubtask from "./AddSubtask"
import SettingEditor from "./SettingEditor"
import TextEditor from "./TextEditor"
import TasksContent from "./TasksReducer"
// import { TaskContent, TextProvider, useTaskContext } from "./TasksReducer"
// import { useTasksContext } from "./TasksContext"
import DatePicker from "./DatePicker"
import dayjs from "dayjs"

const total = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const tags = [
  {
    type: "priority",
    content: ["urgent", "high", "normal", "low"],
  },
  {
    type: "progress",
    content: ["none", "todo", "doing", "done"],
  },
]

const index = () => {
  const [state, dispatch] = useContext(TasksContent)
  // const [state, dispatch] = useTasksContext()
  const { taskID } = useParams()
  const navigation = useNavigate()
  // const { workNumbers } = useContext(SettingContext)
  const [{ workNumbers }, clockSettingDispatch] = useClockSettingReducer()
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
        <div className="flex flex-col gap-3 w-3/4 mt-1">
          <SettingEditor setStartDate={setStartDate} setDueDate={setDueDate} />
          <TextEditor description={state.description} />
          <AddSubtask>AddSubtask</AddSubtask>
        </div>
        <div className="flex flex-col gap-3 mt-1">
          {tags.map((item) => (
            <select
              name="item"
              id="item"
              key={item.type}
              value={state.tags[item]}
              onChange={(e) => {
                dispatch({ type: "editTags", payload: e.target.value.trim() })
              }}
            >
              <option value={-1}>please select</option>
              {item.content.map((tag) => (
                <option value={tag} key={tag}>
                  {tag}
                </option>
              ))}
            </select>
          ))}
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
          <p>Total Time Spent: {totalSpendingTime}</p>
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
          <input
            type="text"
            placeholder="location"
            onChange={(e) => {
              dispatch({ type: "editLocation", payload: e.target.value })
            }}
          />
          <button className="bg-slateDark text-white px-2 py-1 rounded">save</button>
        </div>
        <button
          className="block text-white font-semibold self-start"
          onClick={() => navigation(-1)}
        >
          X
        </button>
      </div>
    </>
  )
}

export default index
