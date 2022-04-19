import React, { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import { useDispatch, useSelector } from "react-redux"
import {
  increaseNumber,
  setPauseStatus,
  //   setSecondsLeft,
  //   tickSecondsBackward,
  setMode,
} from "../../features/clock"

const Clock = () => {
  const { workTime, breakTime } = useSelector((state) => state.clock.setting)
  const { workNumber, breakNumber, totalTime } = useSelector(
    (state) => state.clock.duration
  )
  const { isPaused, mode } = useSelector((state) => state.clock.status)
  const dispatch = useDispatch()
  const [secondsLeft, setSecondsLeft] = useState(0)
  const secondsLeftRef = useRef(secondsLeft)
  const [totalSpendingTime, setTotalSpendingTime] = useState(0)
  const totalTimeRef = useRef(0)
  // const modeRef = useRef(mode)
  //   const secondsLeftRef = useRef(secondsLeft)
  //   const isPausedRef = useRef(isPaused)

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(isPaused, secondsLeft)
      if (isPaused) {
        return
      }
      if (secondsLeftRef.current === 0) {
        return switchMode()
      }
      console.log(secondsLeft)
      tickTime()
    }, [1000])

    return () => clearInterval(timer)
  }, [workTime, breakTime, totalTime])

  useEffect(() => {
    const totalSecondsLeft = totalTime * workTime * 60
    // dispatch(setSecondsLeft(totalSecondsLeft))
    secondsLeftRef.current = totalSecondsLeft
    setSecondsLeft(secondsLeftRef.current)
  }, [])

  useEffect(() => {
    totalTimeRef.current += 1
    setTotalSpendingTime(getClockTime(totalTimeRef.current))
  }, [secondsLeft])

  const switchMode = () => {
    mode === "work"
      ? dispatch(increaseNumber("workNumber"))
      : dispatch(increaseNumber("breakNumber"))
    const nextMode = mode === "work" ? "break" : "work"
    dispatch(setMode(nextMode))
    const nextSeconds = (nextMode === "work" ? workTime : breakTime) * 60 * totalTime
    // dispatch(setSecondsLeft(nextSeconds))

    // setMode(nextMode)
    // modeRef.current = nextMode
    setSecondsLeft(nextSeconds)
    secondsLeftRef.current = nextSeconds
  }

  const tickTime = () => {
    // dispatch(tickSecondsBackward())
    secondsLeftRef.current--
    setSecondsLeft(secondsLeftRef.current)
  }
  const resetTimer = () => {
    confirm("do you really want to reset and clear current progress?")
    const restartSeconds =
      mode === "work" ? workTime * 60 * totalTime : breakTime * 60 * totalTime
    setSecondsLeft(secondsLeftRef)
    // dispatch(setSecondsLeft(restartSeconds))
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
    mode === "work" ? workTime * 60 * totalTime : breakTime * 60 * totalTime
  const percentage = Math.round((secondsLeft / totalSeconds) * 100)

  const minutes = Math.floor(secondsLeft / 60)
  let seconds = secondsLeft % 60
  if (seconds < 10) seconds = "0" + seconds

  return (
    <div className="flex h-screen align-middle">
      <div className="grow my-0">
        <CircularProgressbar
          value={percentage}
          text={minutes + ":" + seconds}
          styles={buildStyles(TimerContent)}
        />
      </div>
      <div>
        <button
          onClick={() => {
            dispatch(setPauseStatus(false))
            // setIsPaused(false)
            // isPausedRef.current = false
          }}
        >
          Play
        </button>
        <button
          onClick={() => {
            dispatch(setPauseStatus(true))
            // setIsPaused(true)
            // isPausedRef.current = true
          }}
        >
          Pause
        </button>
        <button
          onClick={() => {
            dispatch(setPauseStatus(true))
            // setIsPaused(true)
            // isPausedRef.current = true
            resetTimer()
          }}
        >
          Reset
        </button>

        <h3>work time: {workNumber}</h3>
        <h3>break time: {breakNumber}</h3>
        <h3>Total Time Spent:{totalSpendingTime} </h3>
        <Link to="/settings">Setting</Link>
      </div>
    </div>
  )
}

export default Clock
