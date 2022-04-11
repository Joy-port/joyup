import React, { useContext, useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import SettingContext from "./SettingContext"

const TimerContent = {
  textColor: "#000",
  pathColor: mode === "work" ? red : green,
  tailColor: "rgba(255,255,255,.2)",
}

const Clock = () => {
  const settingInfo = useContext(SettingContext)

  return (
    <div>
      <CircularProgressbar value={percentage} text={minutes + ":" + seconds} />
      <div>
        <button>Play</button>
        <button>Pause</button>
      </div>
      <Link to="/settings">Setting</Link>
    </div>
  )
}

export default Clock
