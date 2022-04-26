import React from "react"
import { useDispatch, useSelector } from "react-redux"

const TimeSetting = () => {
  const { timerDuration, workMinutes, breakMinutes } = useSelector(
    (state) => state.settings
  )
  const dispatch = useDispatch()
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
        <h2 className="text-bold">Timer Duration: {timerDuration} minutes</h2>
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
        <h2>Working Time Length: {timerDuration * workMinutes} minutes</h2>
        <div className="flex">
          <h3>{timerDuration} X</h3>
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
        <h2>Break Timer Length: {timerDuration * breakMinutes} minutes</h2>
        <div className="flex">
          <h3>{timerDuration} X</h3>
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
