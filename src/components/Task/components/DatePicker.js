import React, { useState, useCallback, forwardRef } from "react"
import DatePicker from "react-datepicker"
import { any, bool, func, string } from "prop-types"
import dayjs from "dayjs"
import { useDispatch, useSelector } from "react-redux"

const CustomInput = ({ onChange, placeholder, value, id, onClick }) => {
  return (
    <input
      className="bg-light100 w-full rounded select-light300"
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      id={id}
      onClick={onClick}
      // isSecure={isSecure}
    />
  )
}

const DatePick = ({ date, setDate, showType }) => {
  const current = new Date()
  const { startDate, dueDate } = useSelector((state) => state.task)
  const dispatch = useDispatch()
  const addTime = (addTime) => {
    const nowTime = current.getTime()
    const addMlSeconds = addTime * 60 * 60 * 1000
    const newDateObj = new Date(nowTime + addMlSeconds)
    return newDateObj
  }
  const requiredTime = useCallback(() => {
    const minute = dayjs(current).minute()
    const hour = dayjs(current).hour()
    const requireHour = minute > 30 ? 24 - hour : 23 - hour
    const requireMinute = minute > 30 ? "" : ".5"
    return parseFloat(requireHour + requireMinute)
  })
  const [maxTime, setMaxTime] = useState(() => {
    return addTime(requiredTime())
  })
  const onChange = (date) => {
    if (date.toString() !== current.toString()) {
      setMaxTime(addTime(23))
    } else {
      setMaxTime(addTime(requiredTime()))
    }

    return setDate(new Date(date).getTime())
  }
  const handleChangeRaw = (value) => {
    if (value === undefined) return
    if (value.trim().toLowerCase() === "tomorrow") {
      setDate(() => {
        return new Date(dayjs(current).add(1, "day"))
      })
    } else if (value.trim().toLowerCase() === "next week") {
      setDate(() => {
        return new Date(dayjs(current).add(7, "day"))
      })
    } else if (value.trim().toLowerCase() === "next month") {
      setDate(() => {
        return new Date(dayjs(current).add(1, "month"))
      })
    }
  }

  return (
    <DatePicker
      showTimeSelect
      showDisabledMonthNavigation
      selected={date}
      minTime={startDate}
      maxTime={maxTime}
      timeIntervals={30}
      onChange={(date) => {
        onChange(date)
      }}
      onChangeRaw={(event) => handleChangeRaw(event.target.value)}
      dateFormat="MMM dd, HH:mm"
      inline={showType}
      customInput={<CustomInput />}
    />
  )
}

CustomInput.propTypes = {
  onChange: func,
  placeholder: string,
  value: any,
  id: any,
  onClick: func,
  // isSecure: bool.isRequired,
}
DatePick.propTypes = {
  date: any.isRequired,
  setDate: func.isRequired,
  showType: bool.isRequired,
  // hasCustomButton: bool.isRequired,
}

export default DatePick
