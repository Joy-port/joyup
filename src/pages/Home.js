import React, { useCallback, useEffect, useState, useMemo } from "react"
import { Calendar, momentLocalizer, Views } from "react-big-calendar"
import moment from "moment"
import CustomCalendar from "../components/Calendar"
import AgendaToolbar from "../components/Calendar/Toolbar/Agenda"
import * as Icon from "react-feather"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const localizer = momentLocalizer(moment)

const Home = () => {
  const { userTasks } = useSelector((state) => state.user)
  const { totalTaskList, totalProjectList } = useSelector((state) => state.projects)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const updateEvents = useCallback(() => {
    const newEvents = userTasks.map((taskID) => {
      const taskDetail = {
        ...totalTaskList[taskID],
        start: new Date(totalTaskList[taskID].startDate),
        end: new Date(totalTaskList[taskID].dueDate),
      }
      return taskDetail
    })
    return newEvents
  })
  const [events, setEvents] = useState(() => {
    const newEvents = updateEvents()
    return newEvents
  })
  const [type, setType] = useState(0)

  const handleSelectEvent = useCallback((event) => {
    if (totalTaskList[event.id]) {
      dispatch({ type: "task/openSavedTask", payload: event })
      navigate(`/task/${event.id}`)
    }
  })

  useEffect(() => {
    setEvents(() => {
      const newEvents = updateEvents()
      return newEvents
    })
  }, [totalTaskList])

  const AgendaView = useMemo(
    () => ({
      components: {
        toolbar: AgendaToolbar,
      },
      formats: {
        agendaHeaderFormat: ({ start, end }, culture, localizer) =>
          localizer.format(start, "MMM DD", culture) +
          " - " +
          localizer.format(end, "MMM DD", culture),
        agendaDateFormat: (date, culture, localizer) =>
          localizer.format(date, "MMM DD", culture),
        agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
          localizer.format(start, "HH:mm", culture) +
          " - " +
          localizer.format(end, "HH:mm", culture),
      },
    }),
    []
  )

  return (
    <>
      <div className="menu-container">
        <div
          className={`menu-item  ${
            type === 0 ? "menu-item__dark--active" : "menu-item__dark"
          }`}
          onClick={() => setType(0)}
        >
          <Icon.Calendar />
          Calendar
        </div>
        <div
          className={`menu-item  ${
            type !== 0 ? "menu-item__dark--active" : "menu-item__dark"
          }`}
          onClick={() => setType(1)}
        >
          <Icon.Layout />
          Agenda
        </div>
      </div>
      <div className="hidden md:block -mt-5 min-h-18 mb-5"></div>
      {type === 0 ? (
        <CustomCalendar type="day" />
      ) : (
        <Calendar
          components={AgendaView.components}
          dayLayoutAlgorithm="overlap"
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="agenda"
          view={Views.AGENDA}
          style={{ height: "calc(100vh - 150ßpx)" }}
          startAccessor="start"
          endAccessor="end"
          events={events}
          formats={AgendaView.formats}
          length={0.25}
          onSelectEvent={handleSelectEvent} //onclick once
          // onDoubleClickEvent={onDoubleClickEvent} //onclick twice
        />
      )}
    </>
  )
}

export default Home
