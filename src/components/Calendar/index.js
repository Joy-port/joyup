import React, { useMemo } from "react"
import moment from "moment"
import { Calendar, Views, DateLocalizer, momentLocalizer } from "react-big-calendar"

const localizer = momentLocalizer(moment)
const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: "lightblue",
    },
  })

const index = (props) => {
  const { components, defaultDate, max, views } = useMemo(
    () => ({
      components: {
        timeSlotWrapper: ColoredDateCellWrapper,
      },
      defaultDate: new Date(),
      // max: dates.add(dates.endOf(new Date(2015, 17, 1), "day"), -1, "hours"),
      views: Object.keys(Views).map((k) => Views[k]),
    }),
    []
  )

  return (
    <div className="myCustomHeight">
      <Calendar
        localizer={localizer}
        // events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        components={components}
        defaultDate={defaultDate}
        // events={events}
        // max={max}
        showMultiDayTimes
        step={60}
        views={views}
      />
    </div>
  )
}

export default index
