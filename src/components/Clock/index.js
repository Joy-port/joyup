import React, { useContext, useEffect, useRef } from "react"
import { Link, useParams } from "react-router-dom"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import { SettingsContext } from "../../reducers/SettingReducer"
import { ClockContext } from "../../reducers/ClockReducer"

const Clock = () => {
  const [settingState, settingDispatch] = useContext(SettingsContext)
  const { timerDuration, workMinutes, breakMinutes } = settingState
  const [clockState, clockDispatch] = useContext(ClockContext)
  const { isPaused, mode, secondsLeft, workNumbers, breakNumbers } = clockState
  const secondsLeftRef = useRef(secondsLeft)

  const { taskID } = useParams()
  const setTimer = (clockType) => {
    clockDispatch({
      type: "addClockNumber",
      payload: { clockType: clockType },
    })
  }
  const clockStatus = (type, status) => {
    clockDispatch({
      type: "clockAction",
      payload: { type: type, status: status },
    })
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (isPaused) return
      console.log(mode, secondsLeftRef.current)
      if (secondsLeftRef.current === 0) {
        return switchMode()
      }
      tickTime()
    }, [100])

    return () => clearInterval(timer)
  }, [isPaused, mode, secondsLeft])

  useEffect(() => {
    secondsLeftRef.current = timerDuration * workMinutes * 60
    clockStatus("secondsLeft", secondsLeftRef.current)
  }, [])

  useEffect(() => {
    // totalTimeRef.current += 1
    // setTotalSpendingTime(getClockTime(totalTimeRef.current))
  }, [secondsLeft])

  const switchMode = () => {
    mode === 0 ? setTimer("workNumbers") : setTimer("breakNumbers")
    const nextMode = mode === 0 ? 1 : 0
    const nextSeconds = (nextMode === 0 ? workMinutes : breakMinutes) * 60 * timerDuration
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
    secondsLeftRef.current =
      mode === 0 ? workMinutes * 60 * timerDuration : breakMinutes * 60 * timerDuration
    clockStatus("secondsLeft", secondsLeftRef.current)
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
    pathColor: mode === 0 ? "#f54e4e" : "#3e98c7",
    trailColor: "transparent",
    strokeLinecap: "round",
  }
  const totalSeconds =
    mode === 0 ? workMinutes * 60 * timerDuration : breakMinutes * 60 * timerDuration
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
                  clockStatus("isPaused", false)
                  // setIsPaused(false)
                  // isPausedRef.current = false
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
              {/* <h3>Total Time Spent:{totalSpendingTime} </h3> */}
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
