import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getHourTime } from "../../utils/helpers"
import { tags } from "../../store/actions/tags"
import { task } from "../../store/actions/task"
import TitleEditor from "./commands/TitleEditor"
import TextEditor from "./commands/TextEditor"
import DatePicker from "./components/DatePicker"
import * as Icon from "react-feather"
import TimeModal from "./components/TimeModal"

const index = () => {
  const { taskClockSettingModalIsOpen } = useSelector((state) => state.modals)
  const { totalTaskList, userProjects } = useSelector((state) => state.user)
  const { totalProjectList } = useSelector((state) => state.projects)
  const { types, selectedColumnOrder, selectedProjectID } = useSelector(
    (state) => state.tags
  )
  const {
    mode,
    title,
    projectID,
    startDate,
    dueDate,
    tagList,
    clockNumber,
    requiredNumber,
    totalTime,
    allDay,
  } = useSelector((state) => state.task)
  const dispatch = useDispatch()
  const { taskID } = useParams()
  const navigate = useNavigate()
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
    if (dueDate < startDate) {
      setCalendarDueDate(() => {
        const afterStartDate = new Date(startDate).getTime()
        return afterStartDate
      })
    }
  }, [startDate])
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
      <div className="modal-container bg-light000 modal-lg">
        <button
          className="modal-header self-end"
          onClick={() => {
            dispatch({ type: "task/clearTaskWithoutSaving" })
            navigate(-1)
          }}
        >
          <Icon.X size={20} />
        </button>
        <div className="modal-body overflow-y-auto flex flex-col px-5 scrollbar">
          <div className="flex items-center gap-3 mb-6 pl-3" id="taskEditorTitle">
            <Icon.Edit />
            <TitleEditor />
          </div>
          <div className="grow flex flex-col-reverse md:flex-row gap-5 task-scrollbar">
            <div className="flex flex-col gap-3 w-full md:w-1/2">
              <div
                className="pb-4 border-b-1 border-b-light100 flex flex-col gap-3 w-full"
                id="taskEditorTags"
              >
                <div className="select-group">
                  <div className="flex gap-4 items-center max-w-36">
                    <Icon.Folder strokeWidth={1.5} />
                    <p className="group-title">Project</p>
                  </div>
                  <select
                    className="bg-light100 rounded select-light300 cursor-pointer w-1/2 border-0 truncate"
                    value={projectID}
                    onChange={(e) => {
                      const selectedProjectID = e.target.value
                      dispatch(tags.switchProject(selectedProjectID))
                      dispatch(task.saveTaskDetail("projectID", selectedProjectID))
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
                <div className="flex flex-col gap-3">
                  {types &&
                    types.map((item) => (
                      <div
                        className="select-group"
                        key={item.id}
                        id={`taskEditor${item.type}`}
                      >
                        <div className="flex gap-4 items-center max-w-36">
                          {item.type === "priority" ? (
                            <Icon.Flag strokeWidth={1.5} />
                          ) : item.type === "progress" ? (
                            <Icon.CheckSquare strokeWidth={1.5} />
                          ) : (
                            <Icon.Tag strokeWidth={1.5} />
                          )}
                          <p className="group-title">{item.type} </p>
                        </div>
                        <select
                          className="bg-light100 rounded select-light300 cursor-pointer w-1/2 border-0"
                          value={
                            tagList.find((selected) => selected.parent === item.id)
                              ?.child || selectedColumnOrder[0]
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
                </div>
              </div>
              <div
                className="pb-4 border-b-1 border-b-light100 flex flex-col gap-3 w-full"
                id="taskEditorDate"
              >
                <div className="select-group relative">
                  <div className="flex gap-4 items-center max-w-36">
                    <Icon.Calendar strokeWidth={1.5} />
                    <div className="group-title">All Day</div>
                  </div>
                  <div className="flex flex-col w-1/2">
                    <div
                      className={`rounded-full w-14 px-1 py-1 transition-colors cursor-pointer ${
                        allDay ? "bg-blue200" : "bg-light100"
                      }`}
                      onClick={() => {
                        const allDayStatus = !allDay
                        dispatch({
                          type: "task/editDate",
                          payload: { name: "allDay", date: allDayStatus },
                        })
                      }}
                    >
                      <div
                        className={`transition-all max-w-fit ${
                          allDay ? "ml-auto" : "mr-auto"
                        }`}
                      >
                        <Icon.Circle color="white" fill="white" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="select-group relative">
                  <div className="flex gap-4 items-center max-w-36">
                    <Icon.Sun strokeWidth={1.5} size={24} />
                    <div className="group-title">Start Date</div>
                  </div>
                  <div className="flex flex-col w-1/2">
                    <DatePicker
                      date={startDate}
                      setDate={setCalendarStartDate}
                      hasMinDate={false}
                    />
                  </div>
                </div>
                <div className="select-group relative">
                  <div className="flex gap-4 items-center max-w-36">
                    <Icon.Sunset strokeWidth={1.5} size={24} />
                    <div className="group-title">Due Date</div>
                  </div>
                  <div className="flex flex-col w-1/2">
                    <DatePicker
                      date={dueDate}
                      setDate={setCalendarDueDate}
                      hasMinDate={true}
                    />
                  </div>
                </div>
              </div>
              <div className="select-group relative" id="taskEditorClock">
                <div className="flex gap-4 items-center max-w-36">
                  <Icon.Clock strokeWidth={1.5} />
                  <div className="group-title">Tracker</div>
                </div>
                <div
                  className="select-light300 w-1/2  cursor-pointer flex justify-center gap-4"
                  onClick={() => {
                    dispatch({
                      type: "modals/switchTaskClockSettingModal",
                      payload: !taskClockSettingModalIsOpen,
                    })
                  }}
                  onBlur={() =>
                    dispatch({
                      type: "modals/switchTaskClockSettingModal",
                      payload: false,
                    })
                  }
                >
                  <div
                    className={`flex gap-1 items-center text-red200 transition-opacity ${
                      clockNumber ? "" : "opacity-50"
                    }`}
                  >
                    <Icon.Clock color="#DCE1E5" fill="#E56544" />
                    {clockNumber}
                  </div>
                  /
                  <div
                    className={`flex gap-1 items-center text-red200 transition-opacity ${
                      requiredNumber ? "" : "opacity-50"
                    }`}
                  >
                    <Icon.Clock color="#DCE1E5" fill="#E56544" />
                    {requiredNumber}
                  </div>
                </div>
                {taskClockSettingModalIsOpen && <TimeModal />}
              </div>

              <div
                id="taskEditorPressClock"
                className={`button flex justify-center items-center gap-3 h-12 ${
                  mode === 0 ? "button-outline-danger" : "button-primary"
                }`}
                onClick={() => {
                  dispatch({
                    type: "clockAction",
                    payload: { type: "isPaused", status: false },
                  })
                  navigate(`/clocks/${taskID}`, { replace: true })
                }}
              >
                <Icon.Play />
                <p>
                  {getHourTime(totalTime) === 0 ? "Start Timer" : getHourTime(totalTime)}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 h-full grow">
              <TextEditor />
            </div>
          </div>
        </div>
        <div className="modal-footer flex gap-2 items-center w-full md:w-72 md:ml-auto">
          <button
            className="button button-light flex justify-center items-center gap-3 w-1/2"
            id="taskEditorDelete"
            onClick={() => {
              dispatch(task.deleteCurrentTask())
              navigate(-1)
            }}
          >
            <Icon.Trash />
          </button>
          <button
            id="taskEditorSave"
            className="button button-primary flex justify-center items-center gap-3 w-1/2"
            onClick={() => {
              if (title === "") {
                dispatch({
                  type: "alert/status",
                  payload: { text: "please give the task a title", type: "info" },
                })
                return
              }
              dispatch({
                type: "alert/status",
                payload: { text: "task is saved successfully", type: "success" },
              })
              dispatch(task.saveTotalTask())
              navigate(-1)
            }}
          >
            <Icon.Save />
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
export default index
