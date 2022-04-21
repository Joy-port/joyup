import React, { useContext } from "react"
import { SettingsContext } from "../reducers/SettingReducer"

const TimeSetting = () => {
  const [state, dispatch] = useContext(SettingsContext)
  const setTimer = (e, type, value) => {
    if (e.key === "Enter") {
      if (!value) {
        alert("please enter numbers")
        return
      }
      dispatch({
        type: "editTimer",
        payload: { type: type, duration: value },
      })
    }
  }
  const saveToDataBase = () => {
    console.log("connect to firebase")
  }
  return (
    <>
      <div>
        <h2 className="text-bold">Timer Duration: {state.timerDuration} minutes</h2>
        <input
          type="number"
          onChange={(e) =>
            setTimer(e, "timerDuration", parseFloat(e.target.value.trim()))
          }
          onKeyDown={(e) =>
            setTimer(e, "timerDuration", parseFloat(e.target.value.trim()))
          }
        />
      </div>
      <div>
        <h2>Working Time Length: {state.timerDuration * state.workMinutes} minutes</h2>
        <div className="flex">
          <h3>{state.timerDuration} X</h3>
          <input
            type="number"
            onChange={(e) =>
              setTimer(e, "workMinutes", parseFloat(e.target.value.trim()))
            }
            onKeyDown={(e) =>
              setTimer(e, "workMinutes", parseFloat(e.target.value.trim()))
            }
          />
          {/* <button onClick={() => setWorkMinutes(workTimer)}>Confirm</button> */}
        </div>
      </div>
      <div>
        <h2>Break Timer Length: {state.timerDuration * state.breakMinutes} minutes</h2>
        <div className="flex">
          <h3>{state.timerDuration} X</h3>
          <input
            type="number"
            onChange={(e) =>
              setTimer(e, "breakMinutes", parseFloat(e.target.value.trim()))
            }
            onKeyDown={(e) =>
              setTimer(e, "breakMinutes", parseFloat(e.target.value.trim()))
            }
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
