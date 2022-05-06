import { number } from "prop-types"
import React, { useState } from "react"
import { Droplet } from "react-feather"
import "../../assets/styles/circularBar.scss"

const dropArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

const Circular = ({ minutes, seconds }) => {
  const [isFill, setIsFill] = useState(false)
  return (
    <div className="circular-container text-white">
      {dropArray.map((item) => {
        const fill = isFill ? "white" : "transparent"
        return (
          <div className="circular-outer-item" key={item}>
            <Droplet fill={fill} strokeWidth={0.8} size={18} />
          </div>
        )
      })}
      <div className="circular-inner-item">{minutes + ":" + seconds}</div>
    </div>
  )
}
Circular.propTypes = {
  minutes: number.isRequired,
  seconds: number.isRequired,
}
export default Circular
