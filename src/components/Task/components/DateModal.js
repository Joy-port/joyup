import React, { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { X } from "react-feather"
import dayjs from "dayjs"
import { func } from "prop-types"
import { task } from "../../../store/actions/task"
import DatePicker from "../components/DatePicker"

const DateModal = ({ setIsOpenDateModal }) => {
  const { startDate, dueDate } = useSelector((state) => state.task)
  const focusInput = useRef()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [startTimeSelectedStyle, setStartTimeSelectedStyle] = useState({
    borderColor: "transparent",
  })
  const [dueTimeSelectedStyle, setDueTimeSelectedStyle] = useState({
    borderColor: "transparent",
  })
  const dispatch = useDispatch()
  useEffect(() => {
    if (!focusInput.current) {
      focusInput.current = "startDate"
      setStartTimeSelectedStyle({ borderColor: "#669FBA" })
    }
  }, [])
  useEffect(() => {
    const dateContent = {
      name: focusInput.current,
      date: selectedDate,
    }
    dispatch(task.saveTaskDate(dateContent))
  }, [setSelectedDate, selectedDate])

  return (
    <div className="modal-container-popUp hide text-light300 z-30 w-full md:min-w-96 min-h-28 max-h-max overflow-y-auto top-12 right-0">
      <div className="flex justify-between mb-2">
        <p className="grow text-center border-group-title">
          Select {focusInput.current === "startDate" ? "Start Date" : "Due Date"}
        </p>
        <div
          className="text-right w-6 text-light000 hover:text-transparentDark cursor-pointer "
          onClick={() => setIsOpenDateModal(false)}
        >
          <X />
        </div>
      </div>
      <div className="button-group gap-3 w-330 mx-auto mb-3">
        <div
          className="w-1/2 border-2 py-1 px-2 rounded transition-colors cursor-pointer"
          style={startTimeSelectedStyle}
          onClick={() => {
            setDueTimeSelectedStyle({ borderColor: "transparent" })
            focusInput.current = "startDate"
            setStartTimeSelectedStyle({ borderColor: "#669FBA" })
          }}
        >
          {dayjs(startDate).format("MMM DD, HH:mm") || "start date"}
        </div>
        <div
          className="w-1/2 border-2 py-1 px-2 rounded transition-colors cursor-pointer"
          style={dueTimeSelectedStyle}
          onClick={() => {
            setStartTimeSelectedStyle({ borderColor: "transparent" })
            focusInput.current = "dueDate"
            setDueTimeSelectedStyle({ borderColor: "#669FBA" })
          }}
        >
          {dayjs(dueDate).format("MMM DD, HH:mm") || "start date"}
        </div>
      </div>
      <div className="w-330 mx-auto pb-6">
        <DatePicker date={selectedDate} setDate={setSelectedDate} showType={true} />
      </div>
    </div>
  )
}
DateModal.propTypes = {
  setIsOpenDateModal: func.isRequired,
}

export default DateModal
