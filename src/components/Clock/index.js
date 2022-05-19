import React, { useEffect, useRef, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import * as Icon from "react-feather"
import { task } from "../../store/actions/task"
import Circular from "./Circular"

const PromodoroClock = () => {
  const { isFirstTimeUser } = useSelector((state) => state.user)
  const { workTime, breakTime, mode, secondsLeft, secondsRun } = useSelector(
    (state) => state.task
  )
  const { isPaused, workNumbers, totalSpendingSeconds } = useSelector(
    (state) => state.clock
  )
  const { totalTaskList } = useSelector((state) => state.projects)
  const taskDetail = useSelector((state) => state.task)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const secondsLeftRef = useRef(secondsLeft)
  const secondsRunRef = useRef(secondsRun)
  const totalTimeRef = useRef(0)
  const { taskID } = useParams()
  const setTimer = (clockType) => {
    dispatch({
      type: "clock/addClockNumber",
      payload: clockType,
    })
    if (clockType === "workNumbers") {
      dispatch({
        type: "task/clockNumber",
        payload: workNumbers,
      })
    }
  }
  const clockShowNumberIcons = useCallback(() => {
    if (!taskDetail.requiredNumber > 0 || !taskDetail.clockNumber > 0) return
    if (taskDetail.clockNumber >= taskDetail.requiredNumber) {
      return Object.keys(Array.apply(0, Array(taskDetail.clockNumber))).map(
        (_, index) => {
          return (
            <div key={index}>
              <Icon.Clock opacity={1} />
            </div>
          )
        }
      )
    } else {
      return Object.keys(Array.apply(0, Array(taskDetail.requiredNumber))).map(
        (_, index) => {
          const hasSpend = index + 1 <= taskDetail.clockNumber
          return (
            <div className="" key={index}>
              <Icon.Clock opacity={hasSpend ? 1 : 0.5} />
            </div>
          )
        }
      )
    }
  })
  useEffect(() => {
    clockShowNumberIcons()
  }, [clockShowNumberIcons])
  const clockStatus = (type, status) => {
    dispatch({
      type: "clockAction",
      payload: { type: type, status: status },
    })
  }
  const taskStatus = (type, status) => {
    dispatch({
      type: "task/editDate",
      payload: { name: type, date: status },
    })
  }
  useEffect(() => {
    if (isPaused) {
      dispatch(task.saveTaskDetail("totalTime", parseFloat(totalSpendingSeconds)))
      dispatch(task.saveTaskDetail("secondsLeft", parseFloat(secondsLeftRef.current)))
      dispatch(task.saveTaskDetail("secondsRun", parseFloat(secondsRunRef.current)))
    }
  }, [totalSpendingSeconds, isPaused])
  useEffect(() => {
    dispatch(task.saveTaskDetail("clockNumber", parseFloat(workNumbers)))
  }, [workNumbers])
  useEffect(() => {
    const timer = setInterval(() => {
      if (isPaused) return
      const totalRunTime = mode === 0 ? workTime * 60 : breakTime * 60
      if (secondsRunRef.current === totalRunTime && secondsLeftRef.current === 0) {
        return switchMode()
      }
      tickTime()
    }, [1000])

    return () => clearInterval(timer)
  }, [isPaused, mode, secondsLeft, secondsRun])

  useEffect(() => {
    if (secondsRunRef === 0 || isPaused === true) return
    totalTimeRef.current += 1
    dispatch({ type: "clock/calculateTotalTime", payload: totalTimeRef.current })
  }, [secondsRun])

  const switchMode = () => {
    mode === 0 ? setTimer("workNumbers") : setTimer("breakNumbers")
    const nextMode = mode === 0 ? 1 : 0
    const nextSeconds = (nextMode === 0 ? workTime : breakTime) * 60
    secondsLeftRef.current = nextSeconds
    secondsRunRef.current = 0
    taskStatus("secondsLeft", nextSeconds)
    taskStatus("secondsRun", secondsRunRef.current)
    taskStatus("mode", nextMode)
  }

  const tickTime = () => {
    secondsLeftRef.current--
    taskStatus("secondsLeft", secondsLeftRef.current)
    secondsRunRef.current++
    taskStatus("secondsRun", secondsRunRef.current)
  }
  const resetTimer = () => {
    const currentLeftTime = mode === 0 ? workTime * 60 : breakTime * 60
    if (secondsLeftRef.current === currentLeftTime && secondsRunRef.current === 0) return
    secondsLeftRef.current = currentLeftTime
    taskStatus("secondsLeft", secondsLeftRef.current)
    secondsRunRef.current = 0
    taskStatus("secondsRun", secondsRunRef.current)
    dispatch(task.saveTaskDetail("secondsLeft", parseFloat(secondsLeftRef.current)))
    dispatch(task.saveTaskDetail("secondsRun", parseFloat(secondsRunRef.current)))
    dispatch(
      task.saveTaskDetail(
        "totalTime",
        parseFloat(totalSpendingSeconds - secondsRun.current)
      )
    )
  }
  const totalSeconds = mode === 0 ? workTime * 60 : breakTime * 60
  const percentage = Math.round((secondsRun / totalSeconds) * 100)
  let minutes = Math.floor(secondsLeft / 60)
  if (minutes < 10) minutes = "0" + minutes
  let seconds = secondsLeft % 60
  if (seconds < 10) seconds = "0" + seconds
  const modeBackground = mode
    ? "linear-gradient(305deg,#669FBA,#84E0D1)"
    : "linear-gradient(305deg,#E56544,#FF6A99)"

  return (
    <div className="modal-bg">
      <div
        className={`transition-colors modal-container modal-lg ${
          mode === 0 ? "bg-red200" : "bg-blue200"
        }`}
        style={{
          background: modeBackground,
        }}
      >
        <button
          className={`modal-header self-end text-white ${
            isFirstTimeUser ? "invisible" : ""
          }`}
          onClick={() => {
            if (isFirstTimeUser) return
            dispatch({ type: "task/clearTaskWithoutSaving" })
            navigate(-1)
          }}
        >
          <Icon.X size={20} />
        </button>
        <div className="modal-body flex flex-col items-center justify-center overflow-y-auto clock-scrollbar">
          {taskDetail.id === taskID && (
            <div
              className={`absolute top-5 left-50 bg-white rounded-md p-3 w-5/6 shadow cursor-pointer transition-colors ${
                mode ? "text-blue200" : "text-red200"
              }`}
              onClick={() => {
                const taskDetail = totalTaskList[taskID]
                if (taskDetail) {
                  dispatch({ type: "task/openSavedTask", payload: taskDetail })
                }
                navigate(`/tasks/${taskID}`, { replace: true })
              }}
            >
              <div className="flex justify-between items-center">
                <div className={`text-lg ${taskDetail.title !== "" ? "" : "opacity-50"}`}>
                  {taskDetail.title || "New Task"}
                </div>
                <div className={`flex gap-2 ${mode ? "text-blue200" : "text-red200"}`}>
                  {clockShowNumberIcons()}
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col items-center">
            <div className="grow mb-10">
              <Circular
                minutes={minutes.toString()}
                seconds={seconds.toString()}
                percentage={percentage}
                resetTimer={resetTimer}
              />
            </div>
          </div>
        </div>
        <div className={`modal-footer transition-all pb-3`}>
          <div className={`flex justify-between items-end`}>
            <div
              id="clockControlBackToTask"
              className={`button text-white hover:text-transparentWhite ${
                isPaused ? "visible" : "invisible"
              } ${isFirstTimeUser ? "cursor-default" : ""}`}
              onClick={() => {
                if (isFirstTimeUser) return
                const taskDetail = totalTaskList[taskID]
                if (taskDetail) {
                  dispatch({ type: "task/openSavedTask", payload: taskDetail })
                }
                navigate(`/tasks/${taskID}`, { replace: true })
              }}
            >
              <Icon.CornerDownLeft />
            </div>
            <div
              className="flex justify-center items-center gap-6"
              id="clockControlButton"
            >
              {!isPaused && (
                <button
                  className={`play-button text-white  hover:text-transparentWhite`}
                  onClick={() => clockStatus("isPaused", true)}
                >
                  <Icon.PauseCircle size={50} strokeWidth={0.8} />
                </button>
              )}
              {isPaused && (
                <>
                  <button
                    className={`play-button text-white  hover:text-transparentWhite ${
                      isFirstTimeUser ? "cursor-default" : ""
                    }`}
                    onClick={() => {
                      if (isFirstTimeUser) return
                      clockStatus("isPaused", false)
                    }}
                  >
                    <Icon.PlayCircle size={50} strokeWidth={0.8} />
                  </button>

                  {secondsRunRef.current !== 0 && (
                    <button
                      className={`play-button text-white  hover:text-transparentWhite rotate-0 hover:-rotate-180
                      transition-transform`}
                      onClick={() => {
                        clockStatus("isPaused", true)
                        resetTimer()
                      }}
                    >
                      <Icon.RotateCcw size={50} strokeWidth={0.8} />
                    </button>
                  )}
                </>
              )}
            </div>

            <div className={`flex gap-5 ${isPaused ? "visible" : "invisible"}`}>
              <div
                className="button text-white hover:text-transparentWhite invisible"
                onClick={() => {
                  dispatch(task.saveTotalTask())
                  navigate(-1)
                }}
              >
                <Icon.Save />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromodoroClock
