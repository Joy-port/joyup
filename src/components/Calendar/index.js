import React, { useMemo, useState, useCallback } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import { useDispatch, useSelector } from "react-redux"
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"
import { useNavigate } from "react-router-dom"

const localizer = momentLocalizer(moment)
const DragDropCalendar = withDragAndDrop(Calendar)

const index = () => {
  const { selectedProjectTaskList } = useSelector((state) => state.tags)
  const { totalTaskList } = useSelector((state) => state.projects)
  // const task = useSelector((state) => state.task)
  const [events, setEvents] = useState(Object.values(selectedProjectTaskList))
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onDoubleClickEvent = (e) => {
    if (totalTaskList[e.id]) {
      dispatch({ type: "task/openSavedTask", payload: e })
      navigate(`/task/${e.id}`)
    }
  }
  const handleSelectSlot = useCallback(({ start, end }) => {
    console.log("start", start)
    console.log("end", end)
    // dispatch({ type: "task/openSavedTask", payload: e })
    // navigate(`/task/${e.id}`)
    // setEvents((prev) => [...prev, { start, end, title }]) //dispatch
  })

  // const handleSelectEvent = useCallback((event) => window.alert(event.title), [])

  // const { defaultDate, scrollToTime } = useMemo(
  //   () => ({
  //     defaultDate: new Date(2015, 3, 12),
  //     scrollToTime: new Date(1970, 1, 1, 6),
  //   }),
  //   []
  // )

  return (
    <div className="">
      <DragDropCalendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        style={{ height: "calc(100vh - 50px)" }}
        startAccessor="start"
        endAccessor="end"
        selectable
        events={events}
        views={{
          day: true,
          week: true,
          month: true,
        }}
        onDoubleClickEvent={onDoubleClickEvent}
        // onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        // scrollToTime={scrollToTime}
      />
    </div>
  )
}

export default index
