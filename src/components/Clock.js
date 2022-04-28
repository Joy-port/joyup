import React, { useEffect, useRef } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import { useDispatch, useSelector } from "react-redux"
import { getClockTime } from "../helpers/functions"
import { task } from "../sliceReducers/actions/taskAction"
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
    <>
      <div className="task-container">
        <button
          className="self-end"
          onClick={() => {
            if (confirm("quit without saving current change?")) {
              dispatch({ type: "task/clearTaskWithoutSaving" })
              navigate(-1)
            }
          }}
        >
          X
        </button>
        <div className="flex justify-between grow align-middle">
          <div className="w-1/2 my-0">
            <CircularProgressbar
              value={percentage}
              text={minutes + ":" + seconds}
              styles={buildStyles(TimerContent)}
            />
          </div>
          <div className="flex flex-col justify-between">
            <div className="">
              <button
                onClick={() => {
                  clockStatus("isPaused", false)
                }}
              >
                Play
              </button>
              <button onClick={() => clockStatus("isPaused", true)}>Pause</button>
              <button
                onClick={() => {
                  clockStatus("isPaused", true)
                  resetTimer()
                }}
              >
                Reset
              </button>
              <h3>work time: {workNumbers}</h3>
              <h3>break time: {breakNumbers}</h3>
              <h3>Total Time Spent:{getClockTime(totalSpendingSeconds)},</h3>
            </div>
            <div className="flex gap-4">
              <Link to="/settings" className="button">
                Clock Settings
              </Link>
              <div
                className="button"
                onClick={() => navigate(`/task/${taskID}`, { replace: true })}
              >
                Back to Task
              </div>
              <div
                className="button"
                onClick={() => {
                  dispatch(task.saveTotalTask())
                  navigate(-1)
                }}
              >
                Save
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Clock
