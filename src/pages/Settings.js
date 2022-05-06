import React, { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { User, Clock, Save, Edit } from "react-feather"
import { settings } from "../sliceReducers/actions/settings"
import { user } from "../sliceReducers/actions/user"

const TimeSetting = () => {
  const { base, workTime, breakTime } = useSelector((state) => state.settings)
  const { userName } = useSelector((state) => state.user)
  const [isEditName, setIsEditName] = useState(false)
  const [settingType, setSettingType] = useState(0)
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
  // useEffect(() => {
  //   if (isEditName &&) {
  //     nameRef.current.focus()
  //   }
  // }, [isEditName])
  useEffect(() => {
    if (isEditName && nameRef.current) {
      nameRef.current.focus()
    } else if (!isEditName && nameRef.current) {
      nameRef.current = null
    }
  }, [isEditName, nameRef.current])
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
      <div className="menu-container justify-between items-center">
        <div className="menu-item cursor-none" onClick={() => setSettingType(0)}>
          <User size={30} strokeWidth={1} />
          {userName && !isEditName ? (
            <h1
              className="px-2 py-1"
              onClick={() => {
                setIsEditName(true)
              }}
            >
              {userName}
            </h1>
          ) : (
            <input
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
        </div>
        <button
          className="button button-light flex gap-2 items-center"
          onClick={() => dispatch(settings.editSettingsTimer())}
        >
          <Save />
          Save
        </button>
      </div>
      <div className="hidden md:block -mt-5 min-h-18 mb-5"></div>
      <div className="w-96">
        <h1 className="w-44 tag-light200 text-center p-2">Clock Setting</h1>
        <div className="flex flex-col gap-3 border-rounded-light000">
          <div className="flex gap-2 items-center w-full justify-between">
            <Clock strokeWidth={2} />
            <div className="flex gap-2 items-center">
              <input
                className="border-1 border-light200 w-16"
                type="number"
                value={base}
                onChange={(e) => {
                  if (e.target.value <= 0) {
                    return
                  }
                  setTimer("base", parseFloat(e.target.value.trim()))
                }}
                onKeyDown={(e) => {
                  if (e.target.value.trim() === "") return
                  onKeyDown(e, "base", parseFloat(e.target.value.trim()))
                }}
              />
              <p className="py-1 px-2">minutes</p>
            </div>
          </div>
          <div className="flex gap-2 items-center w-full justify-between">
            <p>Work Time = {base * workTime} minutes</p>
            <div className="flex gap-2 items-center">
              <input
                className="border-1 border-light200 w-12"
                type="number"
                value={workTime}
                onChange={(e) => {
                  if (e.target.value <= 0) {
                    return
                  }
                  setTimer("workTime", parseFloat(e.target.value.trim()))
                }}
                onKeyDown={(e) => {
                  if (e.target.value.trim() === "") return
                  onKeyDown(e, "workTime", parseFloat(e.target.value.trim()))
                }}
              />
              *
              <Clock strokeWidth={2} />
            </div>
          </div>
          <div className="flex gap-2 items-center w-full justify-between">
            <p>Break Time = {base * breakTime} minutes</p>
            <div className="flex gap-2 items-center">
              <input
                className="border-1 border-light200 w-12"
                type="number"
                value={breakTime}
                onChange={(e) => {
                  if (e.target.value <= 0) {
                    return
                  }
                  setTimer("breakTime", parseFloat(e.target.value.trim()))
                }}
                onKeyDown={(e) => {
                  if (e.target.value.trim() === "") return
                  onKeyDown(e, "breakTime", parseFloat(e.target.value.trim()))
                }}
              />
              *
              <Clock strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TimeSetting
