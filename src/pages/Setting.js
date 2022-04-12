import React, { useState, useContext, useEffect } from "react"
import SettingContext from "../components/SettingContext"

const Setting = () => {
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
    setWorkMinutes(workTimer * timerDuration)
    setBreakMinutes(breakTimer * timerDuration)
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
        <h2>Working Time Length: {workMinutes} minutes</h2>
        <div className="flex">
          <h3>{timerDuration} X</h3>
          <input type="number" onChange={(e) => setWorkTimer(e.target.value.trim())} />
          <button onClick={() => setWorkMinutes(workTimer * timerDuration)}>
            Confirm
          </button>
        </div>
      </div>
      <div>
        <h2>Break Timer Length: {breakMinutes} minutes</h2>
        <div className="flex">
          <h3>{timerDuration} X</h3>
          <input type="number" onChange={(e) => setBreakTimer(e.target.value)} />
          <button onClick={() => setBreakMinutes(breakTimer * timerDuration)}>
            Confirm
          </button>
        </div>
      </div>
      <button>cancel</button>
      <button onClick={saveToDataBase}>save</button>
    </>
  )
}

export default Setting
