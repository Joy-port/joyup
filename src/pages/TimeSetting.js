import React, { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { settings } from "../sliceReducers/actions/settings"
import { user } from "../sliceReducers/actions/user"

const TimeSetting = () => {
  const { base, workTime, breakTime } = useSelector((state) => state.settings)
  const { userName } = useSelector((state) => state.user)
  const [isEditName, setIsEditName] = useState(false)
  const nameRef = useRef()
  const dispatch = useDispatch()
  const setTimer = useCallback((type, duration) => {
    const settingContent = {
      type,
      duration,
    }
    dispatch({ type: "settings/editSingleTimer", payload: settingContent })
    // dispatch(settings.editSettingsTimer(type, value))
  })
  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus()
    }
  }, [nameRef.current])
  const onKeyDown = (e, type, value) => {
    if (e.key === "Enter") {
      if (!value) {
        alert("please enter numbers")
        return
      }
      setTimer(type, value)
      dispatch(settings.editSettingsTimer())
    }
  }
  return (
    <>
      {userName && !isEditName ? (
        <h1
          className="heading-four px-2 py-1"
          onClick={() => {
            setIsEditName(true)
          }}
        >
          {userName}
        </h1>
      ) : (
        <input
          className="heading-four"
          type="text"
          // value={userName || "name"}
          onKeyDown={(e) => {
            if (e.target.value.trim() === "") return
            if (e.key === "Enter") {
              dispatch(user.saveUserName(e.target.value))
              setIsEditName(false)
            }
          }}
          onBlur={() => setIsEditName(false)}
          placeholder={userName || "edit your user name"}
          ref={nameRef}
        />
      )}
      <div>
        <h2 className="text-bold">Timer Duration: {base} minutes</h2>
        <input
          type="number"
          onChange={(e) => setTimer("base", parseFloat(e.target.value.trim()))}
          onKeyDown={(e) => onKeyDown(e, "base", parseFloat(e.target.value.trim()))}
        />
      </div>
      <div>
        <h2>Working Time Length: {base * workTime} minutes</h2>
        <div className="flex">
          <h3>{base} X</h3>
          <input
            type="number"
            onChange={(e) => setTimer("workTime", parseFloat(e.target.value.trim()))}
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
            onChange={(e) => setTimer("breakTime", parseFloat(e.target.value.trim()))}
            onKeyDown={(e) =>
              onKeyDown(e, "breakTime", parseFloat(e.target.value.trim()))
            }
          />
        </div>
      </div>
      <button
        className="button button-dark w-1/4"
        onClick={() => dispatch(settings.editSettingsTimer())}
      >
        save
      </button>
    </>
  )
}

export default TimeSetting
