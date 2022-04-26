import React, { useContext, useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { TagsContext } from "../../reducers/TagsReducer"
import { TaskContext } from "../../reducers/TaskReducer"
// import { ClockContext } from "../../reducers/ClockReducer"
import TitleEditor from "./commands/TitleEditor"
import TextEditor from "./commands/TextEditor"
import AddSubtask from "./components/AddSubtask"
import DatePicker from "./components/DatePicker"
import dayjs from "dayjs"

const total = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const getClockTime = (time) => {
  let hours = "00"
  let minutes = "00"
  let seconds = "00"
  if (time < 60) {
    seconds = time
    seconds = seconds < 10 ? `0${seconds}` : seconds
  } else if (time > 60 && time < 3600) {
    minutes = Math.floor(time / 60)
    minutes = minutes < 10 ? `0${minutes}` : minutes
    seconds = (time - minutes * 60) % 60
    seconds = seconds < 10 ? `0${seconds}` : seconds
  } else if (time > 3600) {
    hours = Math.floor(time / 3600)
    hours = hours < 10 ? `0${hours}` : hours
    minutes = Math.floor((time - hours * 3600) / 60)
    minutes = minutes < 10 ? `0${minutes}` : minutes
    seconds = (time - hours * 3600 - minutes * 60) / 60
    seconds = seconds < 10 ? `0${seconds}` : seconds
  }
  return `${hours}:${minutes}:${seconds}`
}

const index = () => {
  const { totalSpendingSeconds, workNumbers } = useSelector((state) => state.clock)
  const [state, dispatch] = useContext(TaskContext)
  const [tagState, tagDispatch] = useContext(TagsContext)
  const { taskID } = useParams()
  const navigation = useNavigate()
  const [dueDate, setDueDate] = useState(new Date())
  const [startDate, setStartDate] = useState(new Date())
  const { types } = tagState
  const { tags } = state
  const { ownerProjectList, selectedProjectID } = tagState
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
    dispatch({ type: "editDate", payload: { name: "startDate", date: date } })
  }, [startDate])
  useEffect(() => {
    const date = new Date(startDate).getTime()
    dispatch({ type: "editDate", payload: { name: "dueDate", date: date } })
  }, [dueDate])

  return (
    <>
      <div className="task-container">
        <button
          className="block text-white font-semibold self-end"
          onClick={() => navigation(-1)}
        >
          X
        </button>
        <select
          value={selectedProjectID}
          onChange={(e) => {
            console.log(e.target.value, selectedProjectID)
            projectDispatch({ type: "switchProject", payload: e.target.value })
            tagDispatch({ type: "switchProject", payload: { pid: e.target.value } })
          }}
        >
          {ownerProjectList &&
            ownerProjectList.map((item) => {
              return (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              )
            })}
        </select>
        <div className="flex flex-col gap-5 md:flex-row">
          <div className="flex flex-col gap-3 w-3/4 mt-1">
            <TitleEditor setStartDate={setStartDate} setDueDate={setDueDate} />
            <TextEditor description={state.description} />
            <AddSubtask>AddSubtask</AddSubtask>
          </div>
          <div className="flex flex-col gap-3 mt-1">
            {types.map((item) => (
              <div key={item.id}>
                <p>{item.type} </p>
                <select
                  value={tags.find((selected) => selected.parent === item.id)?.child}
                  onChange={(e) => {
                    const tag = {
                      parent: item.id,
                      child: e.target.value,
                      type: item.type,
                    }
                    dispatch({ type: "editTags", payload: tag })
                    dispatch({
                      type: "saveTagToProjectTags",
                      payload: [item.id, e.target.value],
                    })
                    console.log(state.tags)
                  }}
                >
                  {item.children.map((tag) => (
                    <option value={tag.id} key={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <p>
              Created date: <br />
              {new Date(state.createdDate).toLocaleString()}
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
            <p>Total Time Spent: {getClockTime(totalSpendingSeconds)}</p>
            <p>Already Run Tomatos: {workNumbers}</p>
            <select
              name="number"
              value={state.requiredClockNumber || -1}
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
              value={state.location}
              onChange={(e) => {
                dispatch({ type: "editLocation", payload: e.target.value })
              }}
            />
            <button
              className="bg-slateDark text-white px-2 py-1 rounded"
              onClick={() => {
                dispatch({ type: "saveToDataBase" })
                navigation("/") //to home
              }}
            >
              Create Task
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default index
