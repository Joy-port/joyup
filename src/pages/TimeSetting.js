import React, { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { settings } from "../sliceReducers/actions/settings"

const TimeSetting = () => {
  const { base, workTime, breakTime } = useSelector((state) => state.settings)
  const dispatch = useDispatch()
  const setTimer = useCallback((type, value) => {
    dispatch(settings.editSettingsTimer(type, value))
  })
  const onKeyDown = (e, type, value) => {
    if (e.key === "Enter") {
      if (!value) {
        alert("please enter numbers")
        return
      }
      setTimer(type, value)
    }
  }
  return (
    <>
      <div>
        <h2 className="text-bold">Timer Duration: {base} minutes</h2>
        <input
          type="number"
          // onChange={(e) => setTimer("base", parseFloat(e.target.value.trim()))}
          onKeyDown={(e) => onKeyDown(e, "base", parseFloat(e.target.value.trim()))}
        />
      </div>
      <div>
        <h2>Working Time Length: {base * workTime} minutes</h2>
        <div className="flex">
          <h3>{base} X</h3>
          <input
            type="number"
            // onChange={(e) => setTimer("workTime", parseFloat(e.target.value.trim()))}
            onKeyDown={(e) => onKeyDown(e, "workTime", parseFloat(e.target.value.trim()))}
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
            // onChange={(e) => setTimer("breakTime", parseFloat(e.target.value.trim()))}
            onKeyDown={(e) =>
              onKeyDown(e, "breakTime", parseFloat(e.target.value.trim()))
            }
          />
        </div>
      </div>
      <button onClick={() => {}}>save</button>
    </>
  )
}

export default TimeSetting
