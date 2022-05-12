import React from "react"
import { useDispatch, useSelector } from "react-redux"

const Loader = () => {
  // const dispatch = useDispatch()
  // const status = useSelector((state) => state.status)
  // console.log(status)
  return (
    <div className="lds-ripple">
      <div></div>
      <div></div>
    </div>
  )
}

export default Loader
