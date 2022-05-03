import React, { useCallback, useEffect, useState } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { number } from "prop-types"

const localizer = momentLocalizer(moment)
const Home = () => {
  const { userTasks } = useSelector((state) => state.user)
  const { totalTaskList, totalProjectList } = useSelector((state) => state.projects)
  const dispatch = useDispatch()
  const navigate = useNavigate()
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

  return (
    <div className="flex flex-col">
      <div className="flex">
        <div className="button button-light" onClick={() => setType(0)}>
          Calendar
        </div>
        <div className="button button-light" onClick={() => setType(1)}>
          List
        </div>
      </div>
      {type === 0 ? (
        <Calendar
          dayLayoutAlgorithm="overlap"
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="day"
          style={{ height: "calc(100vh - 50px)" }}
          startAccessor="start"
          endAccessor="end"
          events={events}
          views={{
            day: true,
            agenda: true,
          }}
          resizable
          selectable
          onSelectEvent={handleSelectEvent} //onclick once
          // onDoubleClickEvent={onDoubleClickEvent} //onclick twice
          // onSelectSlot={handleSelectSlot} //add event
          // onEventResize={onEventResize}
          // onEventDrop={onEventDrop}
          // popup //problem will break the view
        />
      ) : (
        <div className="list">List</div>
      )}
    </div>
  )
}

Home.propTypes = {
  type: number,
}

export default Home
