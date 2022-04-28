import React, { useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getClockTime } from "../../helpers/functions"
import { tags } from "../../sliceReducers/actions/tagsAction"
import { task } from "../../sliceReducers/actions/taskAction"
import TitleEditor from "./commands/TitleEditor"
import TextEditor from "./commands/TextEditor"
import AddSubtask from "./components/AddSubtask"
import DatePicker from "./components/DatePicker"
import dayjs from "dayjs"
import { number } from "prop-types"

const total = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const index = ({ taskOpenType }) => {
  const { totalTaskList, userProjects } = useSelector((state) => state.user)
  const { totalProjectList } = useSelector((state) => state.projects)
  const { types, selectedColumnOrder, selectedProjectID } = useSelector(
    (state) => state.tags
  )
  const {
    id,
    projectID,
    createdDate,
    startDate,
    dueDate,
    clockNumber,
    requiredNumber,
    location,
    parent,
    tagList,
    totalTime,
  } = useSelector((state) => state.task)
  const dispatch = useDispatch()
  const { taskID } = useParams()
  const navigation = useNavigate()
  const [address, setAddress] = useState(location)
  const [calendarStartDate, setCalendarStartDate] = useState(startDate)
  const [calendarDueDate, setCalendarDueDate] = useState(dueDate)

  useEffect(() => {
    dispatch(task.saveTaskDetail("projectID", selectedProjectID))
  }, [selectedProjectID])
  useEffect(() => {
    if (!totalTaskList?.taskID) {
      types.forEach((type) => {
        const tag = {
          parent: type.id,
          child: type.children[0].id,
          type: type.type,
        }
        dispatch(task.saveTaskTag(tag))
      })
    }
  }, [])
  useEffect(() => {
    dispatch(task.checkTaskIDToOpen(taskID))
  }, [taskID])
  useEffect(() => {
    if (calendarDueDate < calendarStartDate) {
      setCalendarDueDate(() => {
        const afterStartDate = startDate
        return afterStartDate
      })
    }
  }, [calendarStartDate])
  useEffect(() => {
    const date = new Date(calendarStartDate).getTime()
    const dateContent = { name: "startDate", date }
    dispatch(task.saveTaskDate(dateContent))
  }, [calendarStartDate])
  useEffect(() => {
    const date = new Date(calendarDueDate).getTime()
    const dateContent = { name: "dueDate", date }
    dispatch(task.saveTaskDate(dateContent))
  }, [calendarDueDate])

  return (
    <>
      <div className="task-container">
        <button
          className="self-end"
          onClick={() => {
            if (confirm("quit without saving current change?")) {
              dispatch({ type: "task/clearTaskWithoutSaving" })
              navigation(-1)
            }
          }}
        >
          X
        </button>
        <select
          value={projectID}
          onChange={(e) => {
            dispatch(task.saveTaskDetail("projectID", e.target.value))
          }}
        >
          {userProjects &&
            userProjects.map((projectID) => {
              const projectDetail = totalProjectList[projectID]
              return (
                <option key={projectDetail.id} value={projectDetail.id}>
                  {projectDetail.title}
                </option>
              )
            })}
        </select>
        <div className="flex flex-col gap-5 md:flex-row">
          <div className="flex flex-col gap-3 w-3/4 mt-1">
            <TitleEditor />
            <TextEditor />
            <AddSubtask>AddSubtask</AddSubtask>
          </div>
          <div className="flex flex-col gap-3 mt-1">
            {types &&
              types.map((item) => (
                <div className="flex gap-2 rounded px-2 py-1 bg-white" key={item.id}>
                  <p className="font-semibold">{item.type} </p>
                  <select
                    value={
                      tagList.find((selected) => selected.parent === item.id)?.child ||
                      selectedColumnOrder[0]
                    }
                    onChange={(e) => {
                      dispatch(tags.switchType(item.type))
                      const tag = {
                        parent: item.id,
                        child: e.target.value,
                        type: item.type,
                      }
                      dispatch(task.saveTaskTag(tag))
                    }}
                  >
                    {/* <option value={0}>select {item.type}</option> */}
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
              {new Date(createdDate).toLocaleString()}
            </p>
            <div>Start Date</div>
            <p>{dayjs(new Date(startDate).getTime()).format("MM/DD HH:mm ")}</p>
            <DatePicker
              date={calendarStartDate}
              setDate={setCalendarStartDate}
              showType={false}
            />
            <div>Due Date</div>
            <p>{dayjs(new Date(dueDate).getTime()).format("MM/DD HH:mm ")}</p>
            <DatePicker
              date={calendarDueDate}
              setDate={setCalendarDueDate}
              showType={false}
            />
            <Link to={`/clock/${taskID}`} className="bg-orange text-white">
              OpenClock
            </Link>
            <p>Total Time Spent: {getClockTime(totalTime)}</p>
            <p>Already Run Clock Numbers: {clockNumber}</p>
            <select
              name="number"
              value={requiredNumber || -1}
              onChange={(e) => {
                dispatch(
                  task.saveTaskDetail("requiredNumber", parseFloat(e.target.value))
                )
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
              value={address}
              onChange={(e) => {
                setAddress(e.target.value)
                dispatch(task.saveTaskDetail("location", e.target.value))
              }}
              onKeyDown={(e) => {
                setAddress(e.target.value)
                dispatch(task.saveTaskDetail("location", e.target.value))
              }}
            />
            <button
              className="bg-slateDark text-white px-2 py-1 rounded"
              onClick={() => {
                dispatch(task.saveTotalTask())
                navigation("/dashboard")
              }}
            >
              {taskOpenType === "0" ? "Create Task" : "Save Task"}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

index.propTypes = {
  taskOpenType: number,
}

export default index
