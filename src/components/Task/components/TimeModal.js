import React, { useState } from "react"
import { task } from "../../../sliceReducers/actions/task"
import { getClockTime, getHourTime } from "../../../helpers/functions"
import { useDispatch, useSelector } from "react-redux"
import { X, Clock, Circle, FileText } from "react-feather"
import { func } from "prop-types"
const total = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const TimeModal = ({ setIsOpenTimeModal }) => {
  const dispatch = useDispatch()
  const { workTime, breakTime, clockNumber, requiredTime, requiredNumber, totalTime } =
    useSelector((state) => state.task)
  const [isOpenRequiredSelection, setIsOpenRequiredSelection] = useState(false)
  return (
    <div className="modal-container-popUp hide text-light300 z-30 w-full md:min-w-72 min-h-28 max-h-max overflow-y-auto top-12 right-0">
      <div className="border-group-light200">
        <div className="flex">
          <h4 className="border-group-title text-center grow">Timer</h4>
          <div
            className="text-right w-6 text-light000 hover:text-transparentDark cursor-pointer "
            onClick={() => setIsOpenTimeModal(false)}
          >
            <X />
          </div>
        </div>
        <div className="flex justify-between items-center pb-2 ">
          <div className="flex gap-4 items-center">
            <Clock strokeWidth={1} fill="#E56544" color="#ffffff" />
            <p className="group-title">Work Duration</p>
          </div>
          <div className="flex gap-2 items-center">
            <input
              className={`w-7 bg-light100 text-light300 rounded p-1 ${
                totalTime ? "opacity-50 text-light200" : ""
              }`}
              type="number"
              value={workTime}
              disabled={totalTime && true}
              onChange={(e) => {
                if (e.target.value <= 0) {
                  dispatch({
                    type: "task/workTime",
                    payload: 1,
                  })
                }
                dispatch({
                  type: "task/workTime",
                  payload: e.target.value,
                })
              }}
            />
            <p className="">mins</p>
          </div>
        </div>
        <div className="flex justify-between items-center pb-2 border-b-1 border-b-light100">
          <div className="flex gap-4 items-center">
            <Clock strokeWidth={1} fill="#ACBAC3" color="#ffffff" />
            <p className="group-title">Break Duration</p>
          </div>
          <div className="flex gap-2 items-center">
            <input
              className={`w-7 bg-light100 text-light300 rounded p-1 ${
                totalTime ? "opacity-50 text-light200" : ""
              }`}
              type="number"
              value={breakTime}
              disabled={totalTime && true}
              onChange={(e) => {
                if (e.target.value <= 0) {
                  dispatch({
                    type: "task/breakTime",
                    payload: 1,
                  })
                }
                dispatch({
                  type: "task/breakTime",
                  payload: e.target.value,
                })
              }}
            />
            <p className="">mins</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-between pb-2 border-b-1 border-b-light100">
          <div className="flex gap-2 items-center">
            <Circle strokeWidth={1} size={10} fill="#E56544" color="#ACBAC3" />
            <p className="group-title">Total Task Required Time</p>
          </div>
          <div className="flex gap-2 items-center">
            =
            <input
              className=" text-light300 rounded p-1 border-light100 border-1 "
              type="number"
              value={requiredTime}
              onChange={(e) => {
                if (e.target.value <= 0) {
                  dispatch({
                    type: "task/requiredTime",
                    payload: 0,
                  })
                }
                dispatch({
                  type: "task/requiredTime",
                  payload: e.target.value,
                })
              }}
            />
            mins
          </div>
          <div className="flex gap-2 items-center">
            =
            <div
              className={`flex gap-1 text-red200 transition-opacity ${
                requiredNumber ? "" : "opacity-50"
              }`}
            >
              <Clock color="#fff" fill="#E56544" strokeWidth={1} />
              {requiredNumber}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Circle strokeWidth={1} size={10} fill="#ACBAC3" color="#ACBAC3" />
            <p className="group-title">Task Recording</p>
          </div>
          <div
            className={`w-4/12 ${getHourTime(totalTime) === 0 ? "text-light100" : ""}`}
          >
            {getHourTime(totalTime) === 0 ? "none" : getHourTime(totalTime)}
          </div>
        </div>
        {/* <div
          className="button text-primary flex justify-center items-center gap-3 mb-1"
          onClick={() => navigate(`/clocks/${taskID}`, { replace: true })}
        >
          <PlayCircle />
          <p>Start Timer</p>
        </div> */}
      </div>
    </div>
  )
}

TimeModal.propTypes = {
  setIsOpenTimeModal: func.isRequired,
}

export default TimeModal
