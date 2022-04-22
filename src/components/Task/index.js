import React, { useContext, useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { SettingsContext } from "../../reducers/SettingReducer"
import { TagsContext } from "../../reducers/TagsReducer"
import { TaskContext } from "../../reducers/TaskReducer"
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
  const [tagList, setTagList] = useState(tagState.tags)
  const { tags } = state

  useEffect(() => {
    console.log(tags)
  }, [tags])
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

  const saveToDataBase = () => {}
  return (
    <>
      <div className="task-container">
        <button
          className="block text-white font-semibold self-end"
          onClick={() => navigation(-1)}
        >
          X
        </button>
        <div className="flex gap-5">
          <div className="flex flex-col gap-3 w-3/4 mt-1">
            <TitleEditor setStartDate={setStartDate} setDueDate={setDueDate} />
            <TextEditor description={state.description} />
            <AddSubtask>AddSubtask</AddSubtask>
          </div>
          <div className="flex flex-col gap-3 mt-1">
            {tagList.map((item) => (
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
                  }}
                >
                  <option value={-1}>please select</option>
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
            <button
              className="bg-slateDark text-white px-2 py-1 rounded"
              onClick={saveToDataBase}
            >
              save
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default index
