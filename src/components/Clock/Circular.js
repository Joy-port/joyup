import React from "react"
import { Droplet } from "react-feather"
import { number, string } from "prop-types"

const dropArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

const Circular = ({ minutes, seconds, percentage }) => {
  return (
    <div className="circular-container text-white">
      {dropArray.map((item) => {
        const base = Math.round((1 / dropArray.length) * 100)
        const iconPercentage = Math.round((item / dropArray.length) * 100) - base
        const fill = iconPercentage >= percentage ? "transparent" : "#ffffff"

        return (
          <div className="circular-outer-item" key={item}>
            <Droplet fill={fill} strokeWidth={1} size={20} stroke="#ffffff" />
          </div>
        )
      })}
      <div className="circular-inner-item">
        <div className="middle">{minutes + ":" + seconds}</div>
      </div>
    </div>
  )
}
Circular.propTypes = {
  minutes: string.isRequired,
  seconds: string.isRequired,
  percentage: number.isRequired,
}
export default Circular
