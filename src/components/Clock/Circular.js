import { number, string, func } from "prop-types"
import React from "react"
import { Droplet, Coffee, Sun } from "react-feather"
import { useDispatch, useSelector } from "react-redux"
import "../../assets/styles/circularBar.scss"
import { PlayCircle, PauseCircle, XCircle } from "react-feather"

const dropArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

const Circular = ({ minutes, seconds, percentage, resetTimer }) => {
  // const { mode, isPaused, workNumbers } = useSelector((state) => state.clock)
  // const dispatch = useDispatch()
  // // const clockStatus = (type, status) => {
  //   dispatch({
  //     type: "clockAction",
  //     payload: { type: type, status: status },
  //   })
  // }
  return (
    <div className="circular-container text-white">
      {dropArray.map((item) => {
        const base = Math.round((1 / dropArray.length) * 100)
        const iconPercentage = Math.round((item / dropArray.length) * 100) - base
        {
          /* console.log("%c icon", "color:#ffcc88", iconPercentage, percentage) */
        }
        const fill = iconPercentage >= percentage ? "transparent" : "#ffffff"

        return (
          <div className="circular-outer-item" key={item}>
            <Droplet fill={fill} strokeWidth={1} size={20} stroke="#ffffff" />
          </div>
        )
      })}
      <div className="circular-inner-item">
        {/* <div className="invisible">
          {mode ? (
            <Coffee size={60} strokeWidth={0.35} />
          ) : (
            <Sun size={60} strokeWidth={0.35} />
          )}
        </div> */}
        <div className="middle">{minutes + ":" + seconds}</div>
        {/* <div className="bottom">
          <div className="flex justify-center items-center gap-6">
            {!isPaused && (
              <button
                className={`play-button text-white  hover:text-transparentWhite`}
                onClick={() => clockStatus("isPaused", true)}
              >
                <PauseCircle size={50} strokeWidth={0.5} />
              </button>
            )}
            {isPaused && (
              <>
                <button
                  className={`play-button text-white  hover:text-transparentWhite`}
                  onClick={() => {
                    clockStatus("isPaused", false)
                  }}
                >
                  <PlayCircle size={50} strokeWidth={0.5} />
                </button>
                {workNumbers > 0 && percentage > 0 && (
                  <button
                    className={`play-button text-white  hover:text-transparentWhite`}
                    onClick={() => {
                      clockStatus("isPaused", true)
                      resetTimer()
                    }}
                  >
                    <XCircle size={50} strokeWidth={0.5} />
                  </button>
                )}
              </>
            )}
          </div>
        </div> */}
      </div>
    </div>
  )
}
Circular.propTypes = {
  minutes: string.isRequired,
  seconds: string.isRequired,
  percentage: number.isRequired,
  resetTimer: func.isRequired,
}
export default Circular
