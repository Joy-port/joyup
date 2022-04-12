import React, { useContext, useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import SettingContext from "./SettingContext"

const Clock = () => {
  const {
    timerDuration,
    workMinutes,
    breakMinutes,
    workNumbers,
    setWorkNumbers,
    breakNumbers,
    setBreakNumbers,
  } = useContext(SettingContext)
  const [isPaused, setIsPaused] = useState(false)
  const [mode, setMode] = useState("work")
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [totalSpendingTime, setTotalSpendingTime] = useState(0)

  const secondsLeftRef = useRef(secondsLeft)
  const totalTimeRef = useRef(0)
  const isPausedRef = useRef(isPaused)
  const modeRef = useRef(mode)

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

  const switchMode = () => {
    modeRef.current === "work"
      ? setWorkNumbers((prev) => (prev += 1))
      : setBreakNumbers((prev) => (prev += 1))
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
    <div>
      <CircularProgressbar
        value={percentage}
        text={minutes + ":" + seconds}
        styles={buildStyles(TimerContent)}
      />
      <div>
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
      </div>
      <h3>work time: {workNumbers}</h3>
      <h3>break time: {breakNumbers}</h3>
      <h3>Total Time Spent:{totalSpendingTime} </h3>
      <Link to="/settings">Setting</Link>
    </div>
  )
}

export default Clock
