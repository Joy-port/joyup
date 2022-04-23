import React, { useContext, useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { SettingsContext } from "../../reducers/SettingReducer"
import { TagsContext } from "../../reducers/TagsReducer"
import { TaskContext } from "../../reducers/TaskReducer"
import { ProjectContext } from "../../reducers/ProjectReducer"
import { ClockContext } from "../../reducers/ClockReducer"
import TitleEditor from "./commands/TitleEditor"
import TextEditor from "./commands/TextEditor"
import AddSubtask from "./components/AddSubtask"
import DatePicker from "./components/DatePicker"
import dayjs from "dayjs"

const total = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const index = () => {
  const [state, dispatch] = useContext(TaskContext)
  const [tagState, tagDispatch] = useContext(TagsContext)
  const { taskID } = useParams()
  const navigation = useNavigate()
  const [{ workNumbers }, clockSettingDispatch] = useContext(SettingsContext)
  const { totalSpendingTime } = useContext(ClockContext)
  const [dueDate, setDueDate] = useState(new Date())
  const [startDate, setStartDate] = useState(new Date())
  const { types } = tagState
  const { tags } = state
  const [projectState, projectDispatch] = useContext(ProjectContext)
  const { projectList, currentProjectID } = projectState
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
          value={currentProjectID}
          onChange={(e) => {
            console.log(e)
            projectDispatch({ type: "switchProject", payload: e.target.value })
            tagDispatch({ type: "switchProject", payload: { pid: e.target.value } })
          }}
        >
          {projectList &&
            projectList.map((item) => {
              console.log("project", item)
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
                  value={
                    tags.find((selected) => selected.parent === item.id)?.child || -1
                  }
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
                  }}
                >
                  <option value={-1}>none</option>
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
            <p>Total Time Spent: {totalSpendingTime}</p>
            <p>Already had Tomatos: {workNumbers}</p>
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
