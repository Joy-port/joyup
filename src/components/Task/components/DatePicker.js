import React, { useState, useCallback, useEffect } from "react"
import { useSelector } from "react-redux"
import DatePicker from "react-datepicker"
import { any, bool, func, string } from "prop-types"
import dayjs from "dayjs"

const CustomInput = ({ onChange, placeholder, value, id, onClick }) => {
  return (
    <input
      className="bg-light100 w-full rounded select-light300 cursor-pointer"
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      id={id}
      onClick={onClick}
    />
  )
}

const DatePick = ({ date, setDate, hasMinDate }) => {
  const current = new Date()
  const { startDate, allDay } = useSelector((state) => state.task)
  const [dateFormat, setDateFormat] = useState(() =>
    allDay ? "MMM dd" : "MMM dd, HH:mm"
  )
  const dateFormatting = useCallback(() => {
    if (allDay) {
      setDateFormat("MMM dd")
    } else {
      setDateFormat("MMM dd, HH:mm")
    }
  })
  useEffect(() => {
    dateFormatting()
  }, [dateFormatting, allDay])

  const addTime = (addTime) => {
    const nowTime = current.getTime()
    const addMlSeconds = addTime * 60 * 60 * 1000
    const newDateObj = new Date(nowTime + addMlSeconds)
    return newDateObj
  }
  const requiredTime = useCallback((time) => {
    const minute = dayjs(time).minute()
    const hour = dayjs(time).hour()
    const requireHour = minute > 30 ? 24 - hour : 23 - hour
    const requireMinute = minute > 30 ? "" : ".5"
    return parseFloat(requireHour + requireMinute)
  })
  const [maxTime, setMaxTime] = useState(() => {
    return addTime(requiredTime(startDate))
  })
  const onChange = (date) => {
    if (hasMinDate) {
      if (date.toString() !== startDate.toString()) {
        setMaxTime(addTime(23))
      } else {
        setMaxTime(addTime(requiredTime()))
      }
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
    <>
      {hasMinDate ? (
        <DatePicker
          showTimeSelect={!allDay}
          showDisabledMonthNavigation
          selected={date}
          timeIntervals={30}
          minDate={startDate}
          minTime={startDate}
          maxTime={maxTime}
          onChange={(date) => {
            onChange(date)
          }}
          onChangeRaw={(event) => handleChangeRaw(event.target.value)}
          dateFormat={dateFormat}
          customInput={<CustomInput />}
        />
      ) : (
        <DatePicker
          showTimeSelect={!allDay}
          showDisabledMonthNavigation
          selected={date}
          timeIntervals={30}
          onChange={(date) => {
            onChange(date)
          }}
          onChangeRaw={(event) => handleChangeRaw(event.target.value)}
          dateFormat={dateFormat}
          customInput={<CustomInput />}
        />
      )}
    </>
  )
}

CustomInput.propTypes = {
  onChange: func,
  placeholder: string,
  value: any,
  id: any,
  onClick: func,
}
DatePick.propTypes = {
  date: any.isRequired,
  setDate: func.isRequired,
  hasMinDate: bool.isRequired,
}

export default DatePick
