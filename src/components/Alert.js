import { number, string } from "prop-types"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const Alert = () => {
  const { alertText, alertType, alertIsShow } = useSelector((state) => state.status)
  const getTypeTitle = (type) => {
    if (type === "danger") {
      return "Warning"
    } else if (type === "success") {
      return "Success"
    }
  }
  useEffect(() => {
    console.log("alert", alertText, alertType)
  }, [alertText, alertType])
  return (
    <div
      className={`alert text-${alertType} bg-${alertType}Light ${
        alertIsShow ? "invisible opacity-0" : "visible opacity-100 mr-5"
      }`}
    >
      <h3 className="font-semibold">{getTypeTitle(alertType)}</h3>
      <p>{alertText}</p>
    </div>
  )
}

export default Alert
