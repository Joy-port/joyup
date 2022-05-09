import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getHourTime } from "../../helpers/functions"
import { tags } from "../../sliceReducers/actions/tags"
import { task } from "../../sliceReducers/actions/task"
import TitleEditor from "./commands/TitleEditor"
import TextEditor from "./commands/TextEditor"
import DatePicker from "./components/DatePicker"
import {
  Clock,
  X,
  Trash,
  Save,
  Edit,
  Play,
  Calendar,
  Folder,
  Flag,
  CheckSquare,
  Tag,
  Sunset,
} from "react-feather"
import TimeModal from "./components/TimeModal"

const index = () => {
  const { totalTaskList, userProjects } = useSelector((state) => state.user)
  const { totalProjectList } = useSelector((state) => state.projects)
  const { types, selectedColumnOrder, selectedProjectID } = useSelector(
    (state) => state.tags
  )
  const {
    id,
    mode,
    title,
    projectID,
    startDate,
    dueDate,
    parent,
    tagList,
    clockNumber,
    requiredNumber,
    totalTime,
  } = useSelector((state) => state.task)
  const dispatch = useDispatch()
  const { taskID } = useParams()
  const navigate = useNavigate()
  const [isOpenTimeModal, setIsOpenTimeModal] = useState(false)
  const [calendarStartDate, setCalendarStartDate] = useState(startDate)
  const [calendarDueDate, setCalendarDueDate] = useState(dueDate)
  // const [isOpenDateModal, setIsOpenDateModal] = useState(false)

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

  // useEffect(() => {
  //   if (isOpenDateModal && isOpenTimeModal) {
  //     setIsOpenTimeModal(false)
  //   }
  // }, [setIsOpenDateModal, isOpenDateModal])
  // useEffect(() => {
  //   if (isOpenTimeModal && isOpenDateModal) {
  //     setIsOpenDateModal(false)
  //   }
  // }, [setIsOpenTimeModal, isOpenTimeModal])

  return (
    <div className="modal-bg">
      <div className="modal-container bg-light000 modal-lg">
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
        <div className="modal-body overflow-y-auto flex flex-col">
          <div className="flex items-center gap-3 mb-5 px-3 ">
            <Edit />
            <TitleEditor />
          </div>
          <div className="grow flex flex-col-reverse md:flex-row gap-5 task-scrollbar">
            <div className="flex flex-col gap-3 h-full grow">
              <TextEditor />
              {/* <AddSubtask /> */}
            </div>
            <div className="flex flex-col gap-3 w-full md:w-72">
              <div className="select-group">
                <div className="flex gap-2 items-center max-w-24">
                  <Folder strokeWidth={1} />
                  <p className="group-title">Project</p>
                </div>
                <select
                  className="select-light300 w-1/2"
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
                    <div className="flex gap-2 items-center max-w-24">
                      {item.type === "priority" ? (
                        <Flag strokeWidth={1} />
                      ) : item.type === "progress" ? (
                        <CheckSquare strokeWidth={1} />
                      ) : (
                        <Tag strokeWidth={1} />
                      )}
                      <p className="group-title">{item.type} </p>
                    </div>
                    <select
                      className="select-light300 w-1/2"
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
              <div className="select-group relative">
                <div className="flex gap-2 items-center max-w-24">
                  <Calendar strokeWidth={1} />
                  <div className="group-title">Start Date</div>
                </div>
                <div className="w-1/2">
                  <DatePicker
                    date={calendarStartDate}
                    setDate={setCalendarStartDate}
                    showType={false}
                    hasCustomButton={true}
                  />
                </div>
              </div>
              <div className="select-group relative">
                <div className="flex gap-2 items-center max-w-24">
                  <Sunset strokeWidth={1} />
                  <div className="group-title">Due Date</div>
                </div>
                <div className="w-1/2">
                  <DatePicker
                    date={calendarDueDate}
                    setDate={setCalendarDueDate}
                    showType={false}
                    hasCustomButton={true}
                  />
                </div>
              </div>
              <div className="select-group relative">
                <div className="flex gap-2 items-center max-w-24">
                  <Clock strokeWidth={1} />
                  <div className="group-title">Tracker</div>
                </div>
                <div
                  className="select-light300 w-1/2  cursor-pointer flex justify-center gap-4"
                  onClick={() => {
                    setIsOpenTimeModal(!isOpenTimeModal)
                  }}
                  onBlur={() => setIsOpenTimeModal(false)}
                >
                  <div
                    className={`flex gap-1 text-red200 transition-opacity ${
                      clockNumber ? "" : "opacity-50"
                    }`}
                  >
                    <Clock color="#DCE1E5" fill="#E56544" />
                    {clockNumber}
                  </div>
                  /
                  <div
                    className={`flex gap-1 text-red200 transition-opacity ${
                      requiredNumber ? "" : "opacity-50"
                    }`}
                  >
                    <Clock color="#DCE1E5" fill="#E56544" />
                    {requiredNumber}
                  </div>
                </div>
                {isOpenTimeModal && <TimeModal setIsOpenTimeModal={setIsOpenTimeModal} />}
              </div>

              <div
                className={`button flex justify-center items-center gap-3 h-12 ${
                  mode === 0 ? "button-outline-danger" : "button-primary"
                }`}
                onClick={() => navigate(`/clock/${taskID}`, { replace: true })}
              >
                <Play />
                <p>
                  {getHourTime(totalTime) === 0 ? "Start Timer" : getHourTime(totalTime)}
                </p>
              </div>

              {/* <div className="border-group-light200">
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
            </div> */}
            </div>
          </div>
        </div>
        <div className="modal-footer flex gap-2 w-full md:w-72 md:ml-auto">
          <button
            className="button button-light flex justify-center items-center gap-3 w-1/2"
            onClick={() => {
              if (confirm("confirm to delete the task ")) {
                dispatch(task.deleteCurrentTask())
                navigate(-1)
              }
            }}
          >
            <Trash />
          </button>
          <button
            className="button button-primary flex justify-center gap-3 w-1/2"
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
          </button>
        </div>
      </div>
    </div>
  )
}
export default index
