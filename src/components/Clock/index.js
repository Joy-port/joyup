import React, { useContext, useState, useEffect, useRef } from "react"
import { Link, useParams } from "react-router-dom"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import SettingsContext from "./SettingReducer"
import ClockContext from "./ClockContext"

const Clock = () => {
  const [state, dispatch] = useContext(SettingsContext)
  const { timerDuration, workMinutes, breakMinutes, workNumbers, breakNumbers } = state
  const { setIsPaused, isPausedRef, totalSpendingTime, setTotalSpendingTime } =
    useContext(ClockContext)
  const [mode, setMode] = useState("work")
  const [secondsLeft, setSecondsLeft] = useState(0)
  // const [totalSpendingTime, setTotalSpendingTime] = useState(0)
  // const isPausedRef = useRef(isPaused)

  const secondsLeftRef = useRef(secondsLeft)
  const totalTimeRef = useRef(0)
  const modeRef = useRef(mode)
  const { taskID } = useParams()
  const setTimer = (type) => {
    dispatch({
      type: "addClockNumber",
      payload: { type: type },
    })
  }
  // useEffect(() => {
  //   setTimerDuration(state.timerDuration)
  // }, [state.timerDuration])
  // useEffect(() => {
  //   setWorkMinutes(state.workMinutes)
  // }, [state.workMinutes])
  // useEffect(() => {
  //   setBreakMinutes(state.breakMinutes)
  // }, [state.breakMinutes])

  useEffect(() => {
    const timer = setInterval(() => {
      if (isPausedRef.current) {
        return
      }
      if (secondsLeftRef.current === 0) {
        return switchMode()
      }
      tickTime()
    }, [100])

    return () => clearInterval(timer)
  }, [workMinutes, breakMinutes, timerDuration])

  useEffect(() => {
    secondsLeftRef.current = timerDuration * workMinutes * 60
    setSecondsLeft(secondsLeftRef.current)
  }, [])

  useEffect(() => {
    totalTimeRef.current += 1
    setTotalSpendingTime(getClockTime(totalTimeRef.current))
  }, [secondsLeft])
  //setWorkNumbers((prev) => (prev += 1))
  //setBreakNumbers((prev) => (prev += 1))
  const switchMode = () => {
    modeRef.current === "work" ? setTimer("workNumbers") : setTimer("breakNumbers")
    const nextMode = modeRef.current === "work" ? "break" : "work"
    const nextSeconds =
      (nextMode === "work" ? workMinutes : breakMinutes) * 60 * timerDuration

    setMode(nextMode)
    modeRef.current = nextMode

    setSecondsLeft(nextSeconds)
    secondsLeftRef.current = nextSeconds
  }

  const tickTime = () => {
    secondsLeftRef.current--
    setSecondsLeft(secondsLeftRef.current)
  }
  const resetTimer = () => {
    confirm("do you really want to reset and clear current progress?")
    secondsLeftRef.current =
      mode === "work"
        ? workMinutes * 60 * timerDuration
        : breakMinutes * 60 * timerDuration
    setSecondsLeft(secondsLeftRef.current)
  }
  const getClockTime = (time) => {
    let hours = "00"
    let minutes = "00"
    let seconds = "00"
    if (time < 60) {
      seconds = time
      seconds = seconds < 10 ? `0${seconds}` : seconds
    } else if (time > 60 && time < 3600) {
      minutes = Math.floor(time / 60)
      minutes = minutes < 10 ? `0${minutes}` : minutes
      seconds = (time - minutes * 60) % 60
      seconds = seconds < 10 ? `0${seconds}` : seconds
    } else if (time > 3600) {
      hours = Math.floor(time / 3600)
      hours = hours < 10 ? `0${hours}` : hours
      minutes = Math.floor((time - hours * 3600) / 60)
      minutes = minutes < 10 ? `0${minutes}` : minutes
      seconds = (time - hours * 3600 - minutes * 60) / 60
      seconds = seconds < 10 ? `0${seconds}` : seconds
    }
    return `${hours}:${minutes}:${seconds}`
  }
  const TimerContent = {
    textColor: "#000",
    pathColor: mode === "work" ? "#f54e4e" : "#3e98c7",
    trailColor: "transparent",
    strokeLinecap: "round",
  }
  const totalSeconds =
    mode === "work" ? workMinutes * 60 * timerDuration : breakMinutes * 60 * timerDuration
  const percentage = Math.round((secondsLeft / totalSeconds) * 100)

  const minutes = Math.floor(secondsLeft / 60)
  let seconds = secondsLeft % 60
  if (seconds < 10) seconds = "0" + seconds

  return (
    <>
      <div className="task-container">
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
                  setIsPaused(false)
                  isPausedRef.current = false
                }}
              >
                Play
              </button>
              <button
                onClick={() => {
                  setIsPaused(true)
                  isPausedRef.current = true
                }}
              >
                Pause
              </button>
              <button
                onClick={() => {
                  setIsPaused(true)
                  isPausedRef.current = true
                  resetTimer()
                }}
              >
                Reset
              </button>
              <h3>work time: {workNumbers}</h3>
              <h3>break time: {breakNumbers}</h3>
              <h3>Total Time Spent:{totalSpendingTime} </h3>
            </div>
            <div className="flex gap-4">
              <Link to="/settings" className="button">
                Clock Settings
              </Link>
              <Link to={`/task/${taskID}`} className="button">
                Back to Task
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Clock
