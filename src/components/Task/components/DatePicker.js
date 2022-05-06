import React, { useState, useCallback, forwardRef } from "react"
import DatePicker from "react-datepicker"
import { any, bool, func, string } from "prop-types"
import dayjs from "dayjs"

const CustomInput = ({ onChange, placeholder, value, isSecure, id, onClick }) => {
  return (
    <input
      className="bg-light100 w-36"
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      isSecure={isSecure}
      id={id}
      onClick={onClick}
    />
  )
}

const DatePick = ({ date, setDate, showType, hasCustomButton }) => {
  const current = new Date()
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
    return setDate(date)
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
      // minDate={current}
      // minTime={current}
      // maxTime={maxTime}
      selected={date}
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
  onChange: func.isRequired,
  placeholder: string.isRequired,
  value: any.isRequired,
  isSecure: bool.isRequired,
  id: any.isRequired,
  onClick: func.isRequired,
}
DatePick.propTypes = {
  date: any.isRequired,
  setDate: func.isRequired,
  showType: bool.isRequired,
  hasCustomButton: bool.isRequired,
}

export default DatePick
