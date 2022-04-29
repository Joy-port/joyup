import React, { useEffect, useRef } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import { useDispatch, useSelector } from "react-redux"
import { getClockTime } from "../helpers/functions"
import { task } from "../sliceReducers/actions/taskAction"
import { X, Play, Pause, RotateCcw, Settings, ArrowLeft, Save } from "react-feather"

const Clock = () => {
  const { base, workTime, breakTime } = useSelector((state) => state.settings)
  const { isPaused, mode, secondsLeft, workNumbers, breakNumbers, totalSpendingSeconds } =
    useSelector((state) => state.clock)
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
    textColor: "#000",
    pathColor: mode === 0 ? "#f54e4e" : "#3e98c7",
    trailColor: "transparent",
    strokeLinecap: "round",
  }
  const totalSeconds = mode === 0 ? workTime * 60 * base : breakTime * 60 * base
  const percentage = Math.round((secondsLeft / totalSeconds) * 100)
  const minutes = Math.floor(secondsLeft / 60)
  let seconds = secondsLeft % 60
  if (seconds < 10) seconds = "0" + seconds

  return (
    <div className="modal-bg">
      <div className="modal-container">
        <button
          className="modal-close"
          onClick={() => {
            if (confirm("quit without saving current change?")) {
              dispatch({ type: "task/clearTaskWithoutSaving" })
              navigate(-1)
            }
          }}
        >
          <X size={20} />
        </button>
        <div className="flex flex-col items-center gap-5 grow">
          <div className="w-1/2">
            <CircularProgressbar
              value={percentage}
              text={minutes + ":" + seconds}
              styles={buildStyles(TimerContent)}
            />
          </div>
          <div className="flex flex-col justify-between">
            <div className="">
              <div className="flex justify-center items-center gap-6 mb-4">
                <button
                  className={`play-button ${mode === 0 ? "text-danger" : "text-info"}`}
                  onClick={() => {
                    clockStatus("isPaused", false)
                  }}
                >
                  <Play size={28} />
                </button>
                <button
                  className={`play-button ${mode === 0 ? "text-danger" : "text-info"}`}
                  onClick={() => clockStatus("isPaused", true)}
                >
                  <Pause size={28} />
                </button>
                <button
                  className={`play-button ${mode === 0 ? "text-danger" : "text-info"}`}
                  onClick={() => {
                    clockStatus("isPaused", true)
                    resetTimer()
                  }}
                >
                  <RotateCcw size={28} />
                </button>
              </div>
              <div className="flex flex-col gap-2 font-semibold mb-5">
                <div className="flex gap-2">
                  <h3 className="button button-light grow">work time {workNumbers}</h3>
                  <h3 className="button button-light grow">break time {breakNumbers}</h3>
                </div>
                <h3 className="button button-light">
                  Total Spending Time {getClockTime(totalSpendingSeconds)}
                </h3>
              </div>
            </div>
            <div className="flex justify-evenly ">
              <div
                className="button button-dark"
                onClick={() => navigate(`/task/${taskID}`, { replace: true })}
              >
                <ArrowLeft />
              </div>
              <Link to="/settings" className="button button-dark">
                <Settings />
              </Link>
              <div
                className="button button-dark"
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
