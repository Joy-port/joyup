import React, { useEffect, useRef } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import { useDispatch, useSelector } from "react-redux"
import Circular from "./Circular"
import { getClockTime } from "../../helpers/functions"
import { task } from "../../sliceReducers/actions/task"
import {
  X,
  PlayCircle,
  PauseCircle,
  XCircle,
  Settings,
  ArrowLeft,
  Save,
} from "react-feather"

const Clock = () => {
  const { base, workTime, breakTime } = useSelector((state) => state.settings)
  const { isPaused, mode, secondsLeft, workNumbers, breakNumbers, totalSpendingSeconds } =
    useSelector((state) => state.clock)
  const { totalTaskList } = useSelector((state) => state.projects)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const secondsLeftRef = useRef(secondsLeft)
  const totalTimeRef = useRef(0)
  const { taskID } = useParams()
  const setTimer = (clockType) => {
    dispatch({
      type: "addClockNumber",
      payload: { clockType: clockType },
    })
  }
  const clockStatus = (type, status) => {
    dispatch({
      type: "clockAction",
      payload: { type: type, status: status },
    })
  }
  useEffect(() => {
    dispatch(task.saveTaskDetail("totalTime", parseFloat(totalSpendingSeconds)))
  }, [totalSpendingSeconds])
  useEffect(() => {
    dispatch(task.saveTaskDetail("clockNumber", parseFloat(workNumbers)))
  }, [workNumbers])
  useEffect(() => {
    const timer = setInterval(() => {
      if (isPaused) return
      if (secondsLeftRef.current === 0) {
        return switchMode()
      }
      tickTime()
    }, [100])

    return () => clearInterval(timer)
  }, [isPaused, mode, secondsLeft])

  useEffect(() => {
    secondsLeftRef.current = base * workTime * 60
    clockStatus("secondsLeft", secondsLeftRef.current)
  }, [])

  useEffect(() => {
    if (secondsLeft === 3600 || isPaused === true) return
    totalTimeRef.current += 1
    dispatch({ type: "calculateTotalTime", payload: totalTimeRef.current })
  }, [secondsLeft])

  const switchMode = () => {
    mode === 0 ? setTimer("workNumbers") : setTimer("breakNumbers")
    const nextMode = mode === 0 ? 1 : 0
    const nextSeconds = (nextMode === 0 ? workTime : breakTime) * 60 * base
    secondsLeftRef.current = nextSeconds
    clockStatus("secondsLeft", nextSeconds)
    clockStatus("mode", parseFloat(nextMode))
  }

  const tickTime = () => {
    secondsLeftRef.current--
    clockStatus("secondsLeft", secondsLeftRef.current)
  }
  const resetTimer = () => {
    confirm("do you really want to reset and clear current progress?")
    secondsLeftRef.current = mode === 0 ? workTime * 60 * base : breakTime * 60 * base
    clockStatus("secondsLeft", secondsLeftRef.current)
  }
  const TimerContent = {
    textColor: "#ffffff",
    pathColor: "#ffffff",
    trailColor: "transparent",
    strokeLinecap: "round",
    x: 38,
  }
  const totalSeconds = mode === 0 ? workTime * 60 * base : breakTime * 60 * base
  const percentage = Math.round((secondsLeft / totalSeconds) * 100)
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
          mode ? "bg-blue200" : "bg-red200"
        }`}
        style={{
          background: modeBackground,
        }}
      >
        <button
          className="modal-header self-end text-white"
          onClick={() => {
            // if (confirm("quit without saving current change?")) {
            dispatch({ type: "task/clearTaskWithoutSaving" })
            navigate(-1)
            // }
          }}
        >
          <X size={20} />
        </button>
        <div className="modal-body flex flex-col items-center justify-center">
          <div className="flex flex-col w-1/2 gap-5">
            <div className="grow mb-10">
              <CircularProgressbar
                value={percentage}
                text={minutes + ":" + seconds}
                styles={buildStyles(TimerContent)}
              />
              <Circular minutes={minutes} seconds={seconds} />
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
          {/* <div className="flex flex-col gap-2 font-semibold mb-5">
                <div className="flex gap-2">
                  <h3 className="button button-light grow">work time {workNumbers}</h3>
                  <h3 className="button button-light grow">break time {breakNumbers}</h3>
                </div>
                <h3 className="button button-light">
                  Total Spending Time {getClockTime(totalSpendingSeconds)}
                </h3>
              </div> */}
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
                navigate(`/tasks/${taskID}`, { replace: true })
              }}
            >
              <ArrowLeft />
            </div>
            <div className="flex gap-5">
              <Link
                to="/settings"
                className="button text-white hover:text-transparentWhite"
              >
                <Settings />
              </Link>
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

export default Clock
