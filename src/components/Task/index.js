import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getClockTime } from "../../helpers/functions"
import { tags } from "../../sliceReducers/actions/tags"
import { task } from "../../sliceReducers/actions/task"
import TitleEditor from "./commands/TitleEditor"
import TextEditor from "./commands/TextEditor"
import AddSubtask from "./components/AddSubtask"
import DatePicker from "./components/DatePicker"
import dayjs from "dayjs"
import { Clock, X, Archive, Save, Edit, Type } from "react-feather"

const total = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const index = () => {
  const { totalTaskList, userProjects } = useSelector((state) => state.user)
  const { totalProjectList } = useSelector((state) => state.projects)
  const { types, selectedColumnOrder, selectedProjectID } = useSelector(
    (state) => state.tags
  )
  const {
    id,
    title,
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
  const navigate = useNavigate()
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
    <div className="modal-bg">
      <div className="modal-container bg-light100 modal-lg">
        <button
          className="modal-header self-end"
          onClick={() => {
            if (confirm("quit without saving current change?")) {
              dispatch({ type: "task/clearTaskWithoutSaving" })
              navigate(-1)
            }
          }}
        >
          <X size={20} />
        </button>
        <div className="modal-body flex flex-col gap-5 md:flex-row task-scrollbar">
          <div className="flex flex-col gap-3 h-full grow">
            <div className="flex gap-3">
              <Edit />
              <h1 className="text-lg">Task</h1>
            </div>
            <TitleEditor />
            <div className="flex gap-3">
              <Type></Type>
              <h1 className="text-lg">Description</h1>
            </div>
            <TextEditor />
            <AddSubtask />
          </div>
          <div className="flex flex-col gap-3 w-full md:w-72">
            <div className="select-group">
              <p className="group-title">Project</p>
              <select
                className="select-light300 select-dropDown"
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
            </div>
            {types &&
              types.map((item) => (
                <div className="select-group" key={item.id}>
                  <p className="group-title">{item.type} </p>
                  <select
                    className="select-light300 select-dropDown"
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
                    {item.children.map((tag) => (
                      <option value={tag.id} key={tag.id}>
                        {tag.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            <div className="border-group-light200">
              <h4 className="border-group-title">Date</h4>
              <div className="button-group">
                <p className="group-title w-28">Created Date:</p>
                <p className="rounded px-2 py-1  w-36">
                  {dayjs(createdDate).format("MMM DD, HH:mm")}
                </p>
              </div>
              <div className="button-group">
                <p className="group-title w-28">Start Date</p>
                {/* <p>{dayjs(new Date(startDate).getTime()).format("MM/DD HH:mm ")}</p> */}
                <DatePicker
                  date={calendarStartDate}
                  setDate={setCalendarStartDate}
                  showType={false}
                  hasCustomButton={true}
                />
              </div>
              <div className="button-group">
                <div className="group-title w-28">Due Date</div>
                {/* <p>{dayjs(new Date(dueDate).getTime()).format("MM/DD HH:mm ")}</p> */}
                <DatePicker
                  date={calendarDueDate}
                  setDate={setCalendarDueDate}
                  showType={false}
                  hasCustomButton={true}
                />
              </div>
            </div>
            <div className="border-group-light200">
              <h4 className="border-group-title">Timer</h4>
              <div className="flex justify-between">
                <p className="group-title">Time:</p>
                <p className="w-4/12 text-center">{getClockTime(totalTime)}</p>
              </div>
              <div className="flex justify-between">
                <p className="group-title">Run Clocks:</p>
                <p className="w-4/12 text-center">{clockNumber}</p>
              </div>
              <div className="flex justify-between">
                <p className="group-title">Required Clocks:</p>
                <select
                  className="select-light300 w-4/12 align-middle"
                  name="number"
                  value={requiredNumber || -1}
                  onChange={(e) => {
                    dispatch(
                      task.saveTaskDetail("requiredNumber", parseFloat(e.target.value))
                    )
                  }}
                >
                  <option value={-1} disabled>
                    0
                  </option>
                  {total.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div
                className="button button-dark flex justify-center gap-3 mb-1"
                onClick={() => navigate(`/clock/${taskID}`, { replace: true })}
              >
                <Clock />
                <p>Open Clock</p>
              </div>
            </div>
            <div className="border-group-light200">
              <div className="border-group-title">location</div>
              <p className="text-light300">{location || "no selected location"}</p>
              <input
                className="input-light300 select-group mb-1"
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
            </div>
          </div>
        </div>
        <div className="modal-footer mr-3 flex gap-2 w-full md:w-72 md:ml-auto">
          <button
            className="button button-light flex justify-center items-center gap-3 w-1/2"
            onClick={() => {
              if (confirm("confirm to delete the task ")) {
                dispatch(task.deleteCurrentTask())
                navigate(-1)
              }
            }}
          >
            <Archive />
            Archive
          </button>
          <button
            className="button button-dark flex justify-center gap-3 w-1/2"
            onClick={() => {
              if (title === "") {
                alert("please fill in text title")
                return
              }
              dispatch(task.saveTotalTask())
              navigate(-1)
            }}
          >
            <Save />
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
export default index
