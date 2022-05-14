import React, { useEffect, useRef, useState } from "react"
import { task } from "../../../sliceReducers/actions/task"
import { getClockTime, getHourTime } from "../../../helpers/functions"
import { useDispatch, useSelector } from "react-redux"
import { X, Clock, Circle, FileText } from "react-feather"
import { checkProjectMessage } from "../../../helpers/config"

const TimeModal = () => {
  const modalOpenScrollRef = useRef()
  const { taskClockSettingModalIsOpen } = useSelector((state) => state.modals)
  const dispatch = useDispatch()
  const { workTime, breakTime, clockNumber, requiredTime, requiredNumber, totalTime } =
    useSelector((state) => state.task)
  const [requiredNumberError, setRequiredNumberError] = useState(2)
  const [workTimeError, setWorkTimeError] = useState(2)
  const [breakTimeError, setBreakTimeError] = useState(2)
  const [requiredNumberErrorMessage, setRequiredNumberErrorMessage] = useState("")
  const [workTimeErrorMessage, setWorkTimeErrorMessage] = useState("")
  const [breakTimeErrorMessage, setBreakTimeErrorMessage] = useState("")
  useEffect(() => {
    if (taskClockSettingModalIsOpen && modalOpenScrollRef) {
      modalOpenScrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [taskClockSettingModalIsOpen])

  const checkWhenEditNumber = (value, type) => {
    let limitNumber = 0
    type.includes("required") ? (limitNumber = 0) : (limitNumber = 1)
    if (value < limitNumber) {
      dispatch({
        type: type,
        payload: limitNumber,
      })
    } else if (value.length > 3) {
      dispatch({
        type: type,
        payload: parseInt(value / 10),
      })
    } else {
      dispatch({
        type: type,
        payload: value,
      })
    }
  }

  const checkWorkTime = (inputWorkTime, type) => {
    let errorType = null
    let errorMessage = null
    type.includes("workTime")
      ? (errorType = setWorkTimeError)
      : (errorType = setBreakTimeError)
    type.includes("workTime")
      ? (errorMessage = setWorkTimeErrorMessage)
      : (errorMessage = setBreakTimeErrorMessage)
    if (inputWorkTime) {
      errorType(2)
      errorMessage("")
    } else if (!parseFloat(inputWorkTime)) {
      errorType(0)
      errorMessage(checkProjectMessage.editClockWorkTime.notNumber)
    } else if (inputWorkTime.length > 480) {
      errorType(0)
      errorMessage(checkProjectMessage.editClockWorkTime.lengthError)
    } else if (inputWorkTime.length < 1) {
      errorType(2)
      errorMessage(checkProjectMessage.editClockWorkTime.required)
    } else {
      errorType(2)
      errorMessage("")
    }
  }

  const checkRequiredNumber = (e) => {
    const inputRequiredTime = e.target.value
    if (inputRequiredTime) {
      console.log(inputRequiredTime)
      setRequiredNumberError(2)
      setRequiredNumberErrorMessage("")
    } else if (!parseFloat(inputRequiredTime)) {
      setRequiredNumberError(0)
      setRequiredNumberErrorMessage(checkProjectMessage.editClockWorkTime.notNumber)
    } else if (inputRequiredTime.length > 480) {
      setRequiredNumberError(0)
      setRequiredNumberErrorMessage(checkProjectMessage.editClockWorkTime.lengthError)
    } else {
      setRequiredNumberError(2)
      setRequiredNumberErrorMessage("")
    }
  }

  return (
    <div
      className="modal-container-popUp hide text-light300 z-30 w-full md:min-w-72 min-h-28 max-h-max overflow-y-auto top-14 right-0 mb-5"
      ref={modalOpenScrollRef}
    >
      <div className="border-group-light200">
        <div className="flex">
          <h4 className="border-group-title text-center grow">Timer</h4>
          <div
            className="text-right w-6 text-light000 hover:text-transparentDark cursor-pointer "
            onClick={() =>
              dispatch({
                type: "modals/switchTaskClockSettingModal",
                payload: false,
              })
            }
          >
            <X />
          </div>
        </div>
        <div className="flex justify-between items-center pb-2 ">
          <div className="flex gap-4 items-center">
            <Clock strokeWidth={1} fill="#E56544" color="#ffffff" />
            <p className="group-title">Work Duration</p>
          </div>
          <div className="flex gap-2 items-center border-0">
            <input
              className={`w-7 bg-light100 text-light300 rounded p-1 border-0 ${
                totalTime ? "opacity-50 text-light200" : ""
              } ${workTimeError ? "text-light300" : "text-danger"}`}
              type="number"
              value={workTime}
              disabled={totalTime && true}
              onChange={(e) => {
                checkWorkTime(e.target.value, "workTime")
                checkWhenEditNumber(e.target.value, "task/workTime")
              }}
            />
            <p className="">mins</p>
          </div>
        </div>
        {/* <div className="-mt-4 ml-auto">
          <small
            className={`text-danger h-2 ${
              workTimeErrorMessage ? "visible" : "invisible"
            }`}
          >
            {workTimeErrorMessage}
          </small>
        </div> */}
        <div className="flex justify-between items-center pb-2 border-b-1 border-b-light100">
          <div className="flex gap-4 items-center">
            <Clock strokeWidth={1} fill="#ACBAC3" color="#ffffff" />
            <p className="group-title">Break Duration</p>
          </div>
          <div className="flex gap-2 items-center">
            <input
              className={`w-7 bg-light100 rounded p-1 border-0 ${
                totalTime ? "opacity-50 text-light200" : ""
              }${breakTimeError ? "text-light300" : "text-danger"}`}
              type="number"
              value={breakTime}
              disabled={totalTime && true}
              onChange={(e) => {
                checkWorkTime(e.target.value, "breakTime")
                checkWhenEditNumber(e.target.value, "task/breakTime")
              }}
            />
            <p className="">mins</p>
          </div>
        </div>
        {/* <div className="">
          <small
            className={`text-danger ml-5 h-2 -my-3 ${
              breakTimeErrorMessage ? "visible" : "invisible"
            }`}
          >
            {breakTimeErrorMessage}
          </small>
        </div> */}
        <div className="flex flex-col gap-2 justify-between pb-2 border-b-1 border-b-light100">
          <div className="flex gap-2 items-center">
            <Circle strokeWidth={1} size={10} fill="#E56544" color="#ACBAC3" />
            <p className="group-title">Total Task Required Time</p>
          </div>
          <div className="flex gap-2 items-center">
            =
            <input
              className={` text-light300 rounded p-1 border-light100 border-1 focus:border-transparent ${
                requiredNumberError === 0
                  ? "text-danger border-danger"
                  : "border-light100"
              }`}
              type="number"
              value={requiredTime}
              onChange={(e) => {
                checkRequiredNumber(e)
                checkWhenEditNumber(e.target.value, "task/requiredTime")
              }}
            />
            mins
          </div>
          <small
            className={`text-danger ml-5 h-4 -my-1 ${
              requiredNumberErrorMessage ? "visible" : "invisible"
            }`}
          >
            {requiredNumberErrorMessage}
          </small>
          <div className="flex gap-2 items-center">
            =
            <div
              className={`flex gap-1 text-red200 transition-opacity ${
                requiredNumber ? "" : "opacity-50"
              } `}
            >
              <Clock color="#fff" fill="#E56544" strokeWidth={1} />
              {requiredNumber}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Circle strokeWidth={1} size={10} fill="#ACBAC3" color="#ACBAC3" />
            <p className="group-title">Task Recording</p>
          </div>
          <div
            className={`w-4/12 ${getHourTime(totalTime) === 0 ? "text-light100" : ""}`}
          >
            {getHourTime(totalTime) === 0 ? "none" : getHourTime(totalTime)}
          </div>
        </div>
        {/* <div
          className="button text-primary flex justify-center items-center gap-3 mb-1"
          onClick={() => navigate(`/clocks/${taskID}`, { replace: true })}
        >
          <PlayCircle />
          <p>Start Timer</p>
        </div> */}
      </div>
    </div>
  )
}

export default TimeModal
