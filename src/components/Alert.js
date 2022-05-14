import { number, string } from "prop-types"
import React from "react"

const Alert = ({ text, type }) => {
  const getTypeTitle = (type) => {
    if (type === "danger") {
      return "Warning"
    } else if (type === "success") {
      return "Success"
    }
  }
  return (
    <div
      className={`alert text-${type} bg-${type}Light ${
        isHidden ? "invisible opacity-0" : "visible opacity-100 mr-5"
      }`}
    >
      <h3 className="font-semibold">{getTypeTitle(type)}</h3>
      <p>{text}</p>
    </div>
  )
}

Alert.propTypes = {
  text: string,
  type: string,
}
export default Alert
