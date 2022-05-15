import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as Icon from "react-feather"
const Alert = () => {
  const { confirmText } = useSelector((state) => state.status)
  const dispatch = useDispatch()
  const [isShow, setIsShow] = useState(alertIsShow)
  const hideAlert = () => {
    setIsShow(false)
    dispatch({ type: "alert/hide" })
  }
  useEffect(() => {
    let runAlert = null
    if (alertIsShow) {
      setIsShow(true)
      runAlert = setTimeout(() => {
        setIsShow(false)
        dispatch({ type: "alert/hide" })
      }, [2500])
    }
    return () => clearTimeout(runAlert)
  }, [alertIsShow])

  useEffect(() => {
    console.log("alert", alertText, alertType)
  }, [alertText, alertType])

  return (
    <div
      style={{ zIndex: 10000 }}
      className={`alert ${
        alertType === "danger"
          ? "bg-red000 text-red200"
          : alertType === "info"
          ? "bg-blue000 text-blue200"
          : "bg-green000 text-green200"
      } ${!isShow ? "invisible opacity-0" : "visible opacity-80 mr-5"}`}
    >
      {IconName(alertType)}
      <p className="whitespace-wrap grow">{alertText + "!"}</p>
      <div className="relative">
        <div className="absolute -top-3 -right-3 cursor-pointer" onClick={hideAlert}>
          <Icon.X
            color={
              alertType === "danger"
                ? "#E56544"
                : alertType === "info"
                ? "#669FBA"
                : "#60AF7B"
            }
            size={20}
          />
        </div>
      </div>
    </div>
  )
}

export default Alert
