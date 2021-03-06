import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as Icon from "react-feather"
const Alert = () => {
  const { alertText, alertType, alertIsShow } = useSelector((state) => state.status)
  const [isShow, setIsShow] = useState(alertIsShow)
  const dispatch = useDispatch()
  const IconName = (type) => {
    if (type === "danger") {
      return <Icon.AlertCircle color="#FDF0ED" fill="#E56544" />
    } else if (type === "info") {
      return <Icon.Info color="#E3EDF2" fill="#669FBA" />
    } else if (type === "success") {
      return <Icon.CheckCircle color="#F1F8F4" fill="#60AF7B" />
    }
  }
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
