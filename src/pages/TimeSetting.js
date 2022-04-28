import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { settings } from "../sliceReducers/actions/settingsAction"

const TimeSetting = () => {
  const { base, workTime, breakTime } = useSelector((state) => state.settings)
  const dispatch = useDispatch()
  const setTimer = (e, type, value) => {
    if (e.key === "Enter") {
      if (!value) {
        alert("please enter numbers")
        return
      }
      dispatch(settings.editSettingsTimer(type, value))
    }
  }
  const saveToDataBase = () => {
    console.log("connect to firebase")
  }
  return (
    <>
      <div>
        <h2 className="text-bold">Timer Duration: {base} minutes</h2>
        <input
          type="number"
          onChange={(e) => setTimer(e, "base", parseFloat(e.target.value.trim()))}
          onKeyDown={(e) => setTimer(e, "base", parseFloat(e.target.value.trim()))}
        />
      </div>
      <div>
        <h2>Working Time Length: {base * workTime} minutes</h2>
        <div className="flex">
          <h3>{base} X</h3>
          <input
            type="number"
            onChange={(e) => setTimer(e, "workTime", parseFloat(e.target.value.trim()))}
            onKeyDown={(e) => setTimer(e, "workTime", parseFloat(e.target.value.trim()))}
          />
          {/* <button onClick={() => setWorkMinutes(workTimer)}>Confirm</button> */}
        </div>
      </div>
      <div>
        <h2>Break Timer Length: {base * breakTime} minutes</h2>
        <div className="flex">
          <h3>{base} X</h3>
          <input
            type="number"
            onChange={(e) => setTimer(e, "breakTime", parseFloat(e.target.value.trim()))}
            onKeyDown={(e) => setTimer(e, "breakTime", parseFloat(e.target.value.trim()))}
          />
          {/* <button onClick={() => setBreakMinutes(breakTimer)}>Confirm</button> */}
        </div>
      </div>
      <button>cancel</button>
      <button onClick={saveToDataBase}>save</button>
    </>
  )
}

export default TimeSetting
