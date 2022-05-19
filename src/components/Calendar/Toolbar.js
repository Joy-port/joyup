import React, { useCallback, useEffect, useState } from "react"
import { ChevronRight, ChevronLeft } from "react-feather"
import { useNavigate } from "react-router-dom"
import { func, object, string } from "prop-types"
import moment from "moment"

const Day = ({ onView, onNavigate, date, view, type }) => {
  const [viewState, setViewState] = useState(view)
  const [isToday, setIsToday] = useState(true)
  const navigate = useNavigate()
  const addTimeRange = useCallback((type, date, movedRange) => {
    if (type === "month") {
      const selectedDate = date.getDate()
      date.setMonth(date.getMonth() + movedRange)
      if (date.getDate() !== selectedDate) {
        date.setDate(0)
      }
      return date
    }
    let dayMoved = movedRange
    type === "week" ? (dayMoved = dayMoved * 7) : dayMoved
    date.setDate(date.getDate() + dayMoved)
    return date
  })

  const switchBetweenViews = (viewDateRangeType) => {
    onView(viewDateRangeType)
    setViewState(viewDateRangeType)
    navigate(`../calendar/${viewDateRangeType}`)
  }

  const switchDayBackOrForth = (direction) => {
    let dayMoved = 0
    direction === "next" ? (dayMoved = +1) : (dayMoved = -1)
    onNavigate(direction, addTimeRange(viewState, date, dayMoved))
  }

  const switchToCurrentDate = () => {
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
  }, [switchDayBackOrForth, switchBetweenViews, switchToCurrentDate])

  return (
    <div>
      <div className="rbc-toolbar-label text-center">{moment(date).format("MMM DD")}</div>
      <div className="rbc-toolbar justify-between">
        <div className="rbc-btn-group">
          <button type="button" onClick={() => switchDayBackOrForth("prev")}>
            <ChevronLeft />
          </button>
          <button
            type="button"
            className={`${isToday ? "rbc-active" : ""}`}
            onClick={() => switchToCurrentDate()}
          >
            Today
          </button>
          <button type="button" onClick={() => switchDayBackOrForth("next")}>
            <ChevronRight />
          </button>
        </div>
        <div className={`rbc-btn-group ${view === "agenda" ? "hidden" : ""}`}>
          {type !== "day" && (
            <button
              className={`${viewState === "month" ? "rbc-active" : ""}`}
              onClick={() => switchBetweenViews("month")}
            >
              Month
            </button>
          )}
          <button
            className={`${viewState === "week" ? "rbc-active" : ""}`}
            onClick={() => switchBetweenViews("week")}
          >
            Week
          </button>
          <button
            className={`${viewState === "day" ? "rbc-active" : ""}`}
            onClick={() => switchBetweenViews("day")}
          >
            Day
          </button>
        </div>
      </div>
    </div>
  )
}

Day.propTypes = {
  onView: func.isRequired,
  onNavigate: func.isRequired,
  date: object.isRequired,
  view: string.isRequired,
  type: string.isRequired,
}

export default Day
