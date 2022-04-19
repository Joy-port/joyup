import React, { useState, useContext, useEffect } from "react"
import SettingContext from "../components/Clock/SettingContext"

const TimeSetting = () => {
  const {
    timerDuration,
    setTimerDuration,
    workMinutes,
    setWorkMinutes,
    breakMinutes,
    setBreakMinutes,
  } = useContext(SettingContext)

  const [workTimer, setWorkTimer] = useState(workMinutes)
  const [breakTimer, setBreakTimer] = useState(breakMinutes)

  useEffect(() => {
    setWorkMinutes(workTimer)
    setBreakMinutes(breakTimer)
  }, [timerDuration])
  const saveToDataBase = () => {
    console.log("connect to firebase")
  }
  return (
    <>
      <div>
        <h2 className="text-bold">Timer Duration: {timerDuration} minutes</h2>
        <input type="number" onChange={(e) => setTimerDuration(e.target.value.trim())} />
      </div>
      <div>
        <h2>Working Time Length: {timerDuration * workTimer} minutes</h2>
        <div className="flex">
          <h3>{timerDuration} X</h3>
          <input type="number" onChange={(e) => setWorkTimer(e.target.value.trim())} />
          <button onClick={() => setWorkMinutes(workTimer)}>Confirm</button>
        </div>
      </div>
      <div>
        <h2>Break Timer Length: {timerDuration * breakTimer} minutes</h2>
        <div className="flex">
          <h3>{timerDuration} X</h3>
          <input type="number" onChange={(e) => setBreakTimer(e.target.value)} />
          <button onClick={() => setBreakMinutes(breakTimer)}>Confirm</button>
        </div>
      </div>
      <button>cancel</button>
      <button onClick={saveToDataBase}>save</button>
    </>
  )
}

export default TimeSetting
