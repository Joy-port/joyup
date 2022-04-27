import React, { useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getClockTime } from "../../helpers/functions"
import { task } from "../../sliceReducers/actions/taskAction"
import TitleEditor from "./commands/TitleEditor"
import TextEditor from "./commands/TextEditor"
import AddSubtask from "./components/AddSubtask"
import DatePicker from "./components/DatePicker"
import dayjs from "dayjs"

const total = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const index = () => {
  const { totalTaskList, userProjects } = useSelector((state) => state.user)
  const { totalProjectList } = useSelector((state) => state.projects)
  const { types } = useSelector((state) => state.tags)
  const {
    id,
    projectID,
    title,
    description,
    createdDate,
    startDate,
    dueDate,
    clockNumber,
    requiredNumber,
    location,
    parent,
    tags,
    totalTime,
  } = useSelector((state) => state.tasks)
  const { totalSpendingSeconds, workNumbers } = useSelector((state) => state.clock)
  const { taskID } = useParams()
  const navigation = useNavigate()

  // const [dueDate, setDueDate] = useState(new Date())
  // const [startDate, setStartDate] = useState(new Date())
  // const { tags } = state
  // const { ownerProjectList, selectedProjectID } = tagState
  // const { types } = tagState
  useEffect(() => {
    if (id === "") {
      dispatch(task.checkTaskIDToOpen(taskID))
    }
  }, [taskID])
  // useEffect(() => {
  //   if (dueDate < startDate) {
  //     setDueDate(() => {
  //       const afterStartDate = startDate
  //       return afterStartDate
  //     })
  //   }
  // }, [startDate, setStartDate])
  // useEffect(() => {
  //   const date = new Date(startDate).getTime()
  //   dispatch({ type: "editDate", payload: { name: "startDate", date: date } })
  // }, [startDate])
  // useEffect(() => {
  //   const date = new Date(startDate).getTime()
  //   dispatch({ type: "editDate", payload: { name: "dueDate", date: date } })
  // }, [dueDate])

  return (
    <>
      <div className="task-container">
        <button className="self-end" onClick={() => navigation(-1)}>
          X
        </button>
        <select
          value={projectID}
          onChange={(e) => {
            dispatch({ type: "task/selectedProject", payload: e.target.value })
            // projectDispatch({ type: "switchProject", payload: e.target.value })
            // tagDispatch({ type: "switchProject", payload: { pid: e.target.value } })
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
            <TitleEditor setStartDate={setStartDate} setDueDate={setDueDate} />
            <TextEditor description={state.description} />
            <AddSubtask>AddSubtask</AddSubtask>
          </div>
          <div className="flex flex-col gap-3 mt-1">
            {types &&
              types.map((item) => (
                <div className="flex gap-2 rounded px-2 py-1 bg-white" key={item.id}>
                  <p className="font-semibold">{item.type} </p>
                  <select
                    value={tags.find((selected) => selected.parent === item.id)?.child}
                    onChange={(e) => {
                      const tag = {
                        parent: item.id,
                        child: e.target.value,
                        type: item.type,
                      }
                      //direct add to firebase
                      //need to fix
                      dispatch({ type: "task/editTags", payload: tag })
                      dispatch({
                        type: "saveTagToProjectTags",
                        payload: [item.id, e.target.value],
                      })
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
