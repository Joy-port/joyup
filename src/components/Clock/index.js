import React, { useEffect, useRef, useCallback } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Circular from "./Circular"
import { task } from "../../sliceReducers/actions/task"
import {
  X,
  CornerDownLeft,
  Save,
  Clock,
  PlayCircle,
  PauseCircle,
  XCircle,
} from "react-feather"

const PromodoroClock = () => {
  // const { workTime, breakTime } = useSelector((state) => state.settings)
  const { workTime, breakTime, mode } = useSelector((state) => state.task)
  const {
    isPaused,
    // mode,
    secondsLeft,
    secondsRun,
    workNumbers,
    breakNumbers,
    totalSpendingSeconds,
  } = useSelector((state) => state.clock)
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
      console.log(taskDetail.clockNumber, taskDetail.requiredNumber)
      return Object.keys(Array.apply(0, Array(taskDetail.clockNumber))).map(
        (_, index) => {
          return (
            <div key={index}>
              <Clock opacity={1} />
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
              <Clock opacity={hasSpend ? 1 : 0.5} />
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
  useEffect(() => {
    if (isPaused) {
      dispatch(task.saveTaskDetail("totalTime", parseFloat(totalSpendingSeconds)))
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
    secondsLeftRef.current = workTime * 60
    clockStatus("secondsLeft", secondsLeftRef.current)
    secondsRunRef.current = 0
    clockStatus("secondsRun", secondsRunRef.current)
  }, [])

  useEffect(() => {
    // if (secondsLeft === 3600 || isPaused === true) return
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
    clockStatus("secondsLeft", nextSeconds)
    clockStatus("secondsRun", secondsRunRef.current)
    clockStatus("mode", parseFloat(nextMode))
    dispatch({ type: "task/workMode", payload: mode })
  }

  const tickTime = () => {
    secondsLeftRef.current--
    clockStatus("secondsLeft", secondsLeftRef.current)
    secondsRunRef.current++
    clockStatus("secondsRun", secondsRunRef.current)
  }
  const resetTimer = () => {
    confirm("do you really want to reset and clear current progress?")
    secondsLeftRef.current = mode === 0 ? workTime * 60 : breakTime * 60
    clockStatus("secondsLeft", secondsLeftRef.current)
    secondsRunRef.current = 0
    clockStatus("secondsRun", secondsRunRef.current)
  }
  const totalSeconds = mode === 0 ? workTime * 60 : breakTime * 60
  // const percentage = Math.round((secondsLeft / totalSeconds) * 100)
  const percentage = Math.round((secondsRun / totalSeconds) * 100)
  let minutes = Math.floor(secondsLeft / 60)
  if (minutes < 10) minutes = "0" + minutes
  let seconds = secondsLeft % 60
  if (seconds < 10) seconds = "0" + seconds
  const modeBackground = mode
    ? "linear-gradient(305deg,#669FBA,#84E0D1)"
    : "linear-gradient(305deg,#E56544,#FF6A99)"
  //FF6A99
  //F571AE
  //FF6AA0
  //E5666E
  //3e98c7
  //f54e4e
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
          className="modal-header self-end text-white"
          onClick={() => {
            if (confirm("quit without saving current change?")) {
              dispatch({ type: "task/clearTaskWithoutSaving" })
              navigate(-1)
            }
          }}
        >
          <X size={20} />
        </button>
        <div className="modal-body flex flex-col items-center justify-center overflow-y-hidden">
          {taskDetail.id === taskID && (
            <div
              className={`absolute top-10 left-50 md:left-10 bg-white rounded-md  p-3 w-5/6 md:w-3/12 shadow cursor-pointer transition-colors ${
                mode ? "text-blue200" : "text-red200"
              } ${isPaused ? "" : "opacity-50"}`}
              onClick={() => {
                const taskDetail = totalTaskList[taskID]
                if (taskDetail) {
                  dispatch({ type: "task/openSavedTask", payload: taskDetail })
                }
                navigate(`/task/${taskID}`, { replace: true })
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
          <div className="flex flex-col w-1/2">
            <div className="grow mb-10">
              <Circular
                minutes={minutes.toString()}
                seconds={seconds.toString()}
                percentage={percentage}
                resetTimer={resetTimer}
              />
            </div>
            <div className="flex justify-center items-center gap-6">
              {!isPaused && (
                <button
                  className={`play-button text-white  hover:text-transparentWhite`}
                  onClick={() => clockStatus("isPaused", true)}
                >
                  <PauseCircle size={50} strokeWidth={0.8} />
                </button>
              )}
              {isPaused && (
                <>
                  <button
                    className={`play-button text-white  hover:text-transparentWhite`}
                    onClick={() => {
                      clockStatus("isPaused", false)
                    }}
                  >
                    <PlayCircle size={50} strokeWidth={0.8} />
                  </button>
                  <button
                    className={`play-button text-white  hover:text-transparentWhite`}
                    onClick={() => {
                      clockStatus("isPaused", true)
                      resetTimer()
                    }}
                  >
                    <XCircle size={50} strokeWidth={0.8} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div
          className={`modal-footer transition-all ${isPaused ? "visible" : "invisible"}`}
        >
          <div className="flex justify-between">
            <div
              className="button text-white hover:text-transparentWhite"
              onClick={() => {
                const taskDetail = totalTaskList[taskID]
                if (taskDetail) {
                  dispatch({ type: "task/openSavedTask", payload: taskDetail })
                }
                navigate(`/task/${taskID}`, { replace: true })
              }}
            >
              <CornerDownLeft />
            </div>
            <div className="flex gap-5">
              {/* <Link
                to="/settings"
                className="button text-white hover:text-transparentWhite"
              >
                <Settings />
              </Link> */}
              <div
                className="button text-white hover:text-transparentWhite"
                onClick={() => {
                  dispatch(task.saveTotalTask())
                  navigate(-1)
                }}
              >
                <Save />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromodoroClock
