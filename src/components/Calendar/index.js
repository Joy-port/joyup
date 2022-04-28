import React, { useMemo, useState } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import { useSelector } from "react-redux"

const localizer = momentLocalizer(moment)
// const ColoredDateCellWrapper = ({ children }) =>
//   React.cloneElement(React.Children.only(children), {
//     style: {
//       backgroundColor: "lightblue",
//     },
//   })

const index = () => {
  const { selectedProjectTaskList } = useSelector((state) => state.tags)
  const [events, setEvents] = useState(Object.values(selectedProjectTaskList))
  // const { components, defaultDate, max, views } = useMemo(
  //   () => ({
  //     components: {
  //       timeSlotWrapper: ColoredDateCellWrapper,
  //     },
  //     defaultDate: new Date(),
  //     max: new Date(2035, 12, 31),
  //     views: Object.keys(Views).map((k) => Views[k]),
  //   }),
  //   []
  // )

  return (
    <div className="">
      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        style={{ height: "calc(100vh - 50px)" }}
        startAccessor="start"
        endAccessor="end"
        // components={components}
        // defaultDate={defaultDate}
        events={events}
        views={{
          day: true,
          week: true,
          month: true,
        }}
      />
    </div>
  )
}

export default index
