import React, { useContext, useState, useEffect, useRef, useCallback } from "react"
import { Link } from "react-router-dom"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import SettingContext from "./SettingContext"

const Clock = () => {
  const {
    workMinutes,
    breakMinutes,
    workNumbers,
    setWorkNumbers,
    breakNumbers,
    setBreakNumbers,
    totalSpendingTime,
    setTotalSpendingTime,
  } = useContext(SettingContext)
  const [isPaused, setIsPaused] = useState(false)
  const [mode, setMode] = useState("work")
  const [secondsLeft, setSecondsLeft] = useState(0)

  const secondsLeftRef = useRef(secondsLeft)
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
  }, [workMinutes, breakMinutes])

  useEffect(() => {
    secondsLeftRef.current = workMinutes * 60
    setSecondsLeft(secondsLeftRef.current)
  }, [])

  const switchMode = () => {
    modeRef.current === "work"
      ? setWorkNumbers((prev) => (prev += 1))
      : setBreakNumbers((prev) => (prev += 1))
    const nextMode = modeRef.current === "work" ? "break" : "work"
    const nextSeconds = (nextMode === "work" ? workMinutes : breakMinutes) * 60

    setMode(nextMode)
    modeRef.current = nextMode

    setSecondsLeft(nextSeconds)
    secondsLeftRef.current = nextSeconds
  }

  const tickTime = () => {
    secondsLeftRef.current--
    setSecondsLeft(secondsLeftRef.current)
    totalTimeSpent()
  }
  const resetTimer = () => {
    confirm("do you really want to reset and clear current progress?")
    secondsLeftRef.current = mode === "work" ? workMinutes * 60 : breakMinutes * 60
    setSecondsLeft(secondsLeftRef.current)
  }

  const totalTimeSpent = () => {
    const pastNumbers =
      workNumbers * parseFloat(workMinutes) + breakNumbers * parseFloat(breakMinutes)
    let addMinutes = pastNumbers + parseFloat(secondsLeft)
    if (addMinutes < 10) addMinutes = "0" + addMinutes
    let addHours = "00"
    if (addMinutes > 60) {
      addHours = Math.floor(addMinutes / 60)
      addMinutes = addMinutes % 60
      if (addMinutes < 10) addMinutes = "0" + addMinutes
    }
    const addSeconds = 60 - parseFloat(secondsLeft)
    setTotalSpendingTime(addHours + ":" + addMinutes + ":" + addSeconds)
  }
  const TimerContent = {
    textColor: "#000",
    pathColor: mode === "work" ? "#f54e4e" : "#3e98c7",
    trailColor: "transparent",
    strokeLinecap: "round",
  }
  const totalSeconds = mode === "work" ? workMinutes * 60 : breakMinutes * 60
  const percentage = Math.round((secondsLeft / totalSeconds) * 100)

  const minutes = Math.floor(secondsLeft / 60)
  let seconds = secondsLeft % 60
  if (seconds < 10) seconds = "0" + seconds

  console.log(secondsLeftRef.current)

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
      <h3>Total (work): {workNumbers}</h3>
      <h3>Total (breakTime): {breakNumbers}</h3>
      <h3>Total Time Spent: {totalSpendingTime}</h3>
      <Link to="/settings">Setting</Link>
    </div>
  )
}

export default Clock
