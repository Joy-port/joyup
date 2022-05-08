import React, { useState } from "react"
import { task } from "../../../sliceReducers/actions/task"
import { getClockTime, getHourTime } from "../../../helpers/functions"
import { useDispatch, useSelector } from "react-redux"
import { X, Clock, Circle } from "react-feather"
import { func } from "prop-types"
const total = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const TimeModal = ({ setIsOpenTimeModal }) => {
  const dispatch = useDispatch()
  const { clockNumber, requiredNumber, totalTime } = useSelector((state) => state.task)
  const { workTime, breakTime } = useSelector((state) => state.settings)
  const [isOpenRequiredSelection, setIsOpenRequiredSelection] = useState(false)
  return (
    <div className="modal-container-popUp hide text-light300 z-30 w-full md:min-w-72 min-h-28 max-h-max overflow-y-auto top-12 right-0">
      <div className="border-group-light200">
        <div className="flex">
          <h4 className="border-group-title text-center grow">Tracker Settings</h4>
          <div
            className="text-right w-6 text-light000 hover:text-transparentDark cursor-pointer "
            onClick={() => setIsOpenTimeModal(false)}
          >
            <X />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Circle strokeWidth={1} size={10} fill="#ACBAC3" color="#ACBAC3" />
            <p className="group-title">Work Time</p>
          </div>
          <form className="w-4/12">
            <input
              className="select-light300 w-full align-middle"
              type="number"
              value={workTime || 0}
              onChange={(e) => {
                if (e.target.value < 0) return
                dispatch(task.saveTaskDetail("work", parseFloat(e.target.value)))
              }}
            />
          </form>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Circle strokeWidth={1} size={10} fill="#ACBAC3" color="#ACBAC3" />
            <p className="group-title">Required Time</p>
          </div>
          <form className="w-4/12">
            <input
              className="select-light300 w-full align-middle"
              type="number"
              value={requiredNumber || 0}
              onChange={(e) => {
                if (e.target.value < 0) return
                dispatch(
                  task.saveTaskDetail("requiredNumber", parseFloat(e.target.value))
                )
              }}
            />
          </form>
        </div>
        {/* <div
          className="button text-primary flex justify-center items-center gap-3 mb-1"
          onClick={() => navigate(`/clock/${taskID}`, { replace: true })}
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
