import { func, object } from "prop-types"
import React, { useCallback, useEffect, useState } from "react"
import moment from "moment"
import { ChevronRight, ChevronLeft } from "react-feather"

const Month = ({ onView, onNavigate, date }) => {
  const [viewState, setViewState] = useState("month")
  const [isToday, setIsToday] = useState(true)

  const addMonths = useCallback((date, months) => {
    const d = date.getDate()
    date.setMonth(date.getMonth() + months)
    if (date.getDate() != d) {
      date.setDate(0)
    }
    // console.log(date)
    return date
  })

  const addWeeks = useCallback((date, weeks) => {
    date.setDate(date.getDate() + 7 * weeks)
    return date
  })

  const addDays = useCallback((date, days) => {
    date.setDate(date.getDate() + days)
    // console.log(date)
    return date
  })

  const goToDayView = () => {
    onView("day")
    setViewState("day")
  }
  const goToWeekView = () => {
    onView("week")
    setViewState("week")
  }
  const goToMonthView = () => {
    onView("month")
    setViewState("month")
  }

  const goToBack = () => {
    if (viewState === "month") {
      onNavigate("prev", addMonths(date, -1))
    } else if (viewState === "week") {
      onNavigate("prev", addWeeks(date, -1))
    } else {
      onNavigate("prev", addDays(date, -1))
    }
  }

  const goToNext = () => {
    if (viewState === "month") {
      onNavigate("next", addMonths(date, +1))
    } else if (viewState === "week") {
      onNavigate("next", addWeeks(date, +1))
    } else {
      onNavigate("next", addDays(date, +1))
    }
  }

  const goToToday = () => {
    const now = new Date()
    date.setMonth(now.getMonth())
    date.setYear(now.getFullYear())
    date.setDate(now.getDate())
    onNavigate("current")
  }

  useEffect(() => {
    if (date.getDate() === new Date().getDate()) {
      setIsToday(true)
    } else {
      setIsToday(false)
    }
  }, [addMonths, addWeeks, addDays, goToBack, goToNext, goToToday])

  return (
    <div>
      <div className="rbc-toolbar-label text-center">{moment(date).format("MMM DD")}</div>
      <div className="rbc-toolbar justify-between">
        <div className="rbc-btn-group">
          <button type="button" onClick={() => goToBack()}>
            <ChevronLeft />
          </button>
          <button
            type="button"
            className={`${isToday ? "rbc-active" : ""}`}
            onClick={() => goToToday()}
          >
            Today
          </button>
          <button type="button" onClick={() => goToNext()}>
            <ChevronRight />
          </button>
        </div>
        <div className="rbc-btn-group">
          <button
            className={`${viewState === "month" ? "rbc-active" : ""}`}
            onClick={() => goToMonthView()}
          >
            Month
          </button>
          <button
            className={`${viewState === "week" ? "rbc-active" : ""}`}
            onClick={() => goToWeekView()}
          >
            Week
          </button>
          <button
            className={`${viewState === "day" ? "rbc-active" : ""}`}
            onClick={() => goToDayView()}
          >
            Day
          </button>
        </div>
      </div>
    </div>
  )
}

Month.propTypes = {
  onView: func.isRequired,
  onNavigate: func.isRequired,
  date: object.isRequired,
}

export default Month
